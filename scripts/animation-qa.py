import json
import os
import time

origin = os.environ.get('QA_ORIGIN', 'http://localhost:3015')
results = []
target = new_tab(origin)
raw_cdp = cdp
raw_js = js
session = raw_cdp('Target.attachToTarget', targetId=target, flatten=True)['sessionId']


def cdp(method, **params):
    return raw_cdp(method, session_id=session, **params)


def js(expression):
    return raw_js(expression, target_id=target)


def goto_url(url):
    cdp('Page.navigate', url=url)


def wait_for_load():
    for attempt in range(100):
        if js('document.readyState') == 'complete':
            return
        time.sleep(.1)
    raise AssertionError('Page did not finish loading')


def click_at_xy(x, y):
    cdp('Input.dispatchMouseEvent', type='mousePressed', x=x, y=y, button='left', clickCount=1)
    cdp('Input.dispatchMouseEvent', type='mouseReleased', x=x, y=y, button='left', clickCount=1)


def state(expression):
    return json.loads(js('(async () => JSON.stringify(await (' + expression + ')))()'))


def visit(path='/', width=1440):
    cdp('Emulation.setDeviceMetricsOverride', width=width, height=900,
        deviceScaleFactor=1, mobile=width < 768)
    goto_url(origin + path)
    wait_for_load()
    cdp('Page.bringToFront')
    time.sleep(.3)


def sample(selector, scroll=True, slow=False):
    cdp('Page.bringToFront')
    return state('''new Promise(resolve => {
      const element = document.querySelector(%s);
      const samples = [];
      const start = performance.now();
      function record() {
        samples.push({time: performance.now() - start,
          opacity: Number(getComputedStyle(element).opacity),
          text: element.innerText,
          transform: getComputedStyle(element).transform});
      }
      record();
      const initialScroll = scrollY;
      const destination = initialScroll + element.getBoundingClientRect().top - innerHeight + 100;
      if (%s && !%s) element.scrollIntoView({behavior: 'instant', block: 'center'});
      function frame() {
        if (%s) window.scrollTo({top: initialScroll + (destination - initialScroll) * Math.min((performance.now() - start) / 400, 1), behavior: 'instant'});
        record();
        if (performance.now() - start < %s) requestAnimationFrame(frame);
        else resolve(samples);
      }
      requestAnimationFrame(frame);
    })''' % (json.dumps(selector), 'true' if scroll else 'false', 'true' if slow else 'false', 'true' if slow else 'false', 1200 if slow else 800))


def monotonic(values):
    return all(current >= previous - .001 for previous, current in zip(values, values[1:]))


try:
    cdp('Emulation.setFocusEmulationEnabled', enabled=True)
    cdp('Emulation.setEmulatedMedia', features=[{'name': 'prefers-reduced-motion', 'value': 'no-preference'}])
    for width in [1440, 1280, 1024, 768, 430, 375]:
        visit(width=width)
        js("Array.from(document.querySelectorAll('[data-reveal]')).find(element => element.getBoundingClientRect().top > innerHeight + 100).id = 'animation-target'")
        frames = sample('#animation-target')
        opacity = [frame['opacity'] for frame in frames]
        assert monotonic(opacity), ('opacity dropped after entry', width, frames[:8])
        assert opacity[0] == 0 and opacity[-1] == 1, (width, opacity)
        assert frames[-1]['transform'] in ['none', 'matrix(1, 0, 0, 1, 0, 0)']
        assert any(0 < value < 1 for value in opacity), 'Missing transition'
        assert next(frame['time'] for frame in frames if frame['opacity'] == 1) < 650, 'Reveal finished late'
        js("window.scrollTo({top:0,behavior:'instant'})")
        time.sleep(.1)
        assert all(frame['opacity'] == 1 for frame in sample('#animation-target')), 'Reveal replayed'
        assert not state('document.documentElement.scrollWidth > innerWidth')
        results.append({'width': width, 'revealFrames': len(frames), 'monotonic': True})

        visit(width=width)
        js("Array.from(document.querySelectorAll('[data-reveal]')).find(element => element.getBoundingClientRect().top > innerHeight + 100).id = 'slow-target'")
        slow_frames = sample('#slow-target', slow=True)
        assert monotonic([frame['opacity'] for frame in slow_frames]) and slow_frames[-1]['opacity'] == 1

        visit(width=width)
        counters = sample('.studio-stats [aria-hidden="true"]')
        values = [int(frame['text']) for frame in counters]
        assert values[0] == 0 and values[-1] > 0 and monotonic(values), values
        cdp('Page.reload')
        wait_for_load()
        time.sleep(.3)
        assert all(frame['opacity'] == 1 for frame in sample('#main [data-reveal]', scroll=False)), 'Visible content replayed after reload'
        final_count = state('document.querySelector(\'.studio-stats [aria-hidden="true"]\').textContent')
        time.sleep(.7)
        assert state('document.querySelector(\'.studio-stats [aria-hidden="true"]\').textContent') == final_count

        for path in ['/about', '/projects', '/project/the-obsidian-residence', '/enquiry']:
            visit(path, width)
            assert state('document.querySelectorAll("h1").length') == 1, path
            assert state('Array.from(document.querySelectorAll("[data-reveal]")).filter(element => {const rect=element.getBoundingClientRect(); return rect.top < innerHeight && rect.bottom > 0}).every(element => getComputedStyle(element).opacity === "1")'), path

    visit()
    js('window.__navigationMarker = true')
    for name, path in [('Work', '/projects'), ('Studio', '/about'), ('Home', '/')]:
        link = next(node for node in cdp('Accessibility.getFullAXTree')['nodes']
                    if not node.get('ignored') and node.get('role', {}).get('value') == 'link'
                    and node.get('name', {}).get('value', '').casefold() == name.casefold())
        cdp('DOM.scrollIntoViewIfNeeded', backendNodeId=link['backendDOMNodeId'])
        coordinates = cdp('DOM.getBoxModel', backendNodeId=link['backendDOMNodeId'])['model']['content']
        click_at_xy(sum(coordinates[0::2])/4, sum(coordinates[1::2])/4)
        time.sleep(.8)
        assert state('location.pathname') == path and state('window.__navigationMarker'), ('client navigation', path)
        assert state('Array.from(document.querySelectorAll("[data-reveal]")).some(element => element.classList.contains("reveal-pending") || element.classList.contains("is-visible"))'), path

    visit()
    cdp('Emulation.setEmulatedMedia', features=[{'name': 'prefers-reduced-motion', 'value': 'reduce'}])
    assert state('Array.from(document.querySelectorAll("[data-reveal]")).every(element => getComputedStyle(element).opacity === "1")')
    reduced = sample('.studio-stats [aria-hidden="true"]')
    assert len(set(frame['text'] for frame in reduced)) == 1
    visit('/about')
    assert state('Array.from(document.querySelectorAll("[data-reveal]")).every(element => getComputedStyle(element).opacity === "1")')

    cdp('Emulation.setScriptExecutionDisabled', value=True)
    visit()
    assert state('Array.from(document.querySelectorAll("[data-reveal]")).every(element => getComputedStyle(element).opacity === "1")')
    assert int(state('document.querySelector(\'.studio-stats [aria-hidden="true"]\').textContent')) > 0
    print('PASS', json.dumps(results))
finally:
    cdp('Emulation.setScriptExecutionDisabled', value=False)
    cdp('Emulation.setEmulatedMedia', features=[])
    cdp('Emulation.setFocusEmulationEnabled', enabled=False)
