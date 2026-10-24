import json
import os
import time
import urllib.parse

origin = os.environ.get('QA_ORIGIN', 'http://localhost:3015')
artifacts = os.path.join('E:/Webgrow/Poesis', 'artifacts')
os.makedirs(artifacts, exist_ok=True)
results = {'layouts': [], 'interactions': []}
new_tab(origin)
wait_for_load()
instrument = cdp('Page.addScriptToEvaluateOnNewDocument', source="""
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  window.__arvenaErrors = [];
  const previous = console.error;
  console.error = (...args) => { window.__arvenaErrors.push(args.map(String).join(' ')); previous.apply(console, args); };
  addEventListener('error', event => window.__arvenaErrors.push(event.message));
  addEventListener('unhandledrejection', event => window.__arvenaErrors.push(String(event.reason)));
}
""")

def visit(path, width=1440, height=900):
    cdp('Emulation.setDeviceMetricsOverride', width=width, height=height, deviceScaleFactor=1, mobile=width<768)
    goto_url(origin + path)
    wait_for_load()
    time.sleep(.25)

def state(expression):
    return json.loads(js('JSON.stringify(' + expression + ')'))

def element(role, name):
    normalize = lambda text: ''.join(text.split()).casefold()
    matches = [node for node in cdp('Accessibility.getFullAXTree')['nodes'] if not node.get('ignored') and node.get('role', {}).get('value') == role and normalize(node.get('name', {}).get('value','')) == normalize(name)]
    assert matches, (role, name)
    return matches[0]['backendDOMNodeId']

def click(role, name):
    backend = element(role, name)
    cdp('DOM.scrollIntoViewIfNeeded', backendNodeId=backend)
    time.sleep(.15)
    coordinates = cdp('DOM.getBoxModel', backendNodeId=backend)['model']['content']
    click_at_xy(sum(coordinates[0::2])/4, sum(coordinates[1::2])/4)
    time.sleep(.2)

def fill(role, name, value):
    click(role, name)
    cdp('Input.dispatchKeyEvent', type='keyDown', key='a', code='KeyA', modifiers=2, windowsVirtualKeyCode=65)
    cdp('Input.dispatchKeyEvent', type='keyUp', key='a', code='KeyA', modifiers=2, windowsVirtualKeyCode=65)
    press_key('Backspace')
    type_text(value)

def choose(name, index):
    click('combobox', name)
    press_key('Home')
    for _ in range(index):
        press_key('ArrowDown')
    press_key('Enter')
    time.sleep(.15)

try:
    visit('/projects')
    routes = state("[...document.querySelectorAll('.browse-grid a')].map(a=>new URL(a.href).pathname)")
    assert len(set(routes)) == 16
    if os.environ.get('QA_INTERACTIONS_ONLY'):
        with open(f'{artifacts}/browser-qa.json',encoding='utf-8') as previous:
            results['layouts'] = json.load(previous)['layouts']
    for width in ([] if os.environ.get('QA_INTERACTIONS_ONLY') else [1440,1280,1024,768,430,375]):
        paths = ['/', '/projects', '/about', '/enquiry'] + (routes if width in [1440,375] else routes[:1])
        for path in paths:
            visit(path,width,900 if width>=768 else 812)
            js("document.querySelectorAll('img').forEach(image=>image.loading='eager')")
            time.sleep(.45)
            info = state("({title:document.title,overflow:document.documentElement.scrollWidth>innerWidth,h1:document.querySelectorAll('h1').length,broken:[...document.images].filter(i=>i.complete&&!i.naturalWidth).map(i=>i.src),pending:[...document.images].filter(i=>!i.complete).length,errors:window.__arvenaErrors||[],oldBrand:/poiesis|pencipta organik|mayang ratih|jessica sarana/i.test(document.body.innerText)})")
            assert not info['overflow'], (width,path,'overflow')
            assert info['h1'] == 1, (width,path,'h1')
            assert not info['broken'], (width,path,info['broken'])
            assert not info['errors'], (width,path,info['errors'])
            assert not info['oldBrand'], (width,path,'old brand')
            results['layouts'].append({'width':width,'path':path,**info})
            if path in ['/', '/projects','/about','/enquiry',routes[0]] and width in [1440,375]:
                name = path.strip('/').replace('/','-') or 'home'
                capture_screenshot(f'{artifacts}/{name}-{width}.png')
        print('LAYOUT',width,'PASS',flush=True)

    visit('/projects')
    for category,count in [('Architecture',8),('Interior',5),('Residential',14),('Commercial',2),('Landscape',3),('Concept',16),('All',16)]:
        click('button',category)
        assert state("document.querySelectorAll('.browse-grid .project-card').length") == count, category
        assert state("document.querySelector('.filter-navigation [aria-pressed=true]').innerText").casefold() == category.casefold()
    results['interactions'].append('All seven category filters and unique counts')

    visit(routes[0])
    title = state("document.querySelector('h1').innerText")
    click('button',f'Expand {title} image 1')
    assert state("!!document.querySelector('[role=dialog]')")
    click('button','Next image')
    assert '2 of 3' in state("document.querySelector('.lightbox-bottom').innerText")
    press_key('ArrowLeft')
    assert '1 of 3' in state("document.querySelector('.lightbox-bottom').innerText")
    press_key('Escape')
    assert not state("!!document.querySelector('[role=dialog]')")
    results['interactions'].append('Gallery opens, advances, accepts arrow keys, closes with Escape')

    visit('/',375,812)
    click('button','Open navigation')
    assert state("!!document.querySelector('[role=dialog]')")
    for _ in range(8):
        press_key('Tab')
        assert state("!!document.activeElement.closest('[role=dialog]')")
    press_key('Escape')
    assert not state("!!document.querySelector('[role=dialog]')")
    click('button','Open navigation')
    click('link','03 Studio')
    time.sleep(.5)
    assert state('location.pathname') == '/about'
    assert not state("!!document.querySelector('[role=dialog]')")
    results['interactions'].append('Mobile navigation, focus trap, Escape and route dismissal')

    visit('/enquiry')
    click('button','Continue')
    assert state("document.querySelectorAll('[aria-invalid=true]').length") == 2
    assert state('document.activeElement.id') == 'enquiry-fullName'
    fill('textbox','Full name','Alex Morgan')
    fill('textbox','Email address','alex@example.com')
    click('button','Continue')
    assert state("document.querySelector('.enquiry-progress [aria-current=step]').innerText").casefold().endswith('project')
    click('button','Previous')
    assert state("document.querySelector('#enquiry-fullName').value") == 'Alex Morgan'
    click('button','Continue')
    choose('Project type',1)
    fill('textbox','Project location','Garden setting')
    fill('textbox','Tell us about your project','A quiet home with a courtyard & natural light.')
    click('button','Continue')
    fill('spinbutton','Estimated area (m2)','0')
    click('button','Continue')
    assert state("document.querySelector('#enquiry-area').getAttribute('aria-invalid')") == 'true'
    fill('spinbutton','Estimated area (m2)','180')
    fill('textbox','Space requirements','Three bedrooms and a shared living space.')
    choose('Project scope',1)
    click('button','Continue')
    choose('Preferred architectural style',1)
    click('button','Continue')
    assert state("document.querySelectorAll('.review-section').length") == 4
    href = state("[...document.querySelectorAll('.form-actions a')][0].href")
    parsed = urllib.parse.urlparse(href)
    assert parsed.scheme == 'mailto' and parsed.path == 'furni@gmail.com'
    summary = urllib.parse.parse_qs(parsed.query)['body'][0]
    assert 'courtyard & natural light' in summary and '180' in summary and 'Alex Morgan' in summary
    click('button','Edit contact')
    assert state("document.querySelector('#enquiry-email').value") == 'alex@example.com'
    results['interactions'].append('Five-step enquiry validation, back navigation, review editing and encoded email draft; no email sent')
    visit('/enquiry',375,812)
    click('radio','WhatsApp')
    fill('textbox','Full name','Alex Morgan')
    click('button','Continue')
    assert state("document.querySelector('#enquiry-phone').getAttribute('aria-invalid')") == 'true'
    fill('textbox','Phone / WhatsApp','+62 812 3456 7890')
    click('button','Continue')
    assert state("document.querySelector('.enquiry-progress [aria-current=step]').innerText").casefold().endswith('project')
    click('button','Previous')
    assert state("document.querySelector('#enquiry-phone').value") == '+62 812 3456 7890'
    results['interactions'].append('Mobile form uses channel-specific validation and preserves input')
    cdp('Emulation.setEmulatedMedia',features=[{'name':'prefers-reduced-motion','value':'reduce'}])
    visit('/')
    initial = state("document.querySelector('.hero-indicators [aria-pressed=true]').getAttribute('aria-label')")
    time.sleep(6.8)
    assert state("document.querySelector('.hero-indicators [aria-pressed=true]').getAttribute('aria-label')") == initial
    click('button','Show Casa Monolith')
    assert state("document.querySelector('.hero-indicators [aria-pressed=true]').getAttribute('aria-label')") == 'Show Casa Monolith'
    js("document.querySelector('.studio-stats').scrollIntoView({block:'center',behavior:'instant'})")
    time.sleep(.2)
    assert state("document.querySelector('.studio-stats strong').textContent").endswith('16')
    cdp('Emulation.setEmulatedMedia',features=[])
    results['interactions'].append('Reduced motion stops autoplay; manual slideshow controls and portfolio counts work')
    print('INTERACTIONS PASS',flush=True)
finally:
    cdp('Emulation.setEmulatedMedia',features=[])
    cdp('Page.removeScriptToEvaluateOnNewDocument', identifier=instrument['identifier'])
    with open(f'{artifacts}/browser-qa.json','w',encoding='utf-8') as report:
        json.dump(results,report,indent=2)
