import test from "node:test";
import assert from "node:assert/strict";
import { emptyEnquiry, validateStep, enquirySummary, buildMailto } from "../src/lib/enquiry";

test("contact validation follows the selected channel", () => {
  assert.ok(validateStep(0,emptyEnquiry).fullName);
  assert.ok(validateStep(0,emptyEnquiry).email);
  const data = { ...emptyEnquiry, fullName:"Alex Morgan",email:"alex@example.com" };
  assert.deepEqual(validateStep(0,data),{});
  assert.ok(validateStep(0,{...data,contactMethod:"WhatsApp"}).phone);
  assert.deepEqual(validateStep(0,{...data,contactMethod:"WhatsApp",phone:"+62 812 3456 7890"}),{});
  assert.ok(validateStep(0,{...data,website:"javascript:alert(1)"}).website);
  assert.ok(validateStep(0,{...data,fullName:" ".repeat(10)}).fullName);
});
test("project, area and style reject missing or malformed input", () => {
  assert.ok(validateStep(1,emptyEnquiry).projectType);
  assert.ok(validateStep(2,{...emptyEnquiry,area:"0"}).area);
  assert.ok(validateStep(2,{...emptyEnquiry,area:"Infinity"}).area);
  assert.ok(validateStep(3,emptyEnquiry).style);
  assert.deepEqual(validateStep(2,{...emptyEnquiry,area:"125.5",requirements:"Living and working spaces",scope:"New build"}),{});
});
test("email draft encodes user text and never substitutes a recipient", () => {
  const data={...emptyEnquiry,fullName:"Alex & Morgan",email:"alex@example.com",projectType:"Residence",description:"Stone & light? A quiet home."};
  const summary=enquirySummary(data);
  assert.ok(summary.includes(data.description));
  const href=buildMailto("furni@gmail.com",data);
  assert.ok(href);
  assert.ok(href.startsWith("mailto:furni@gmail.com?"));
  assert.ok(decodeURIComponent(href).includes(summary));
  assert.equal(buildMailto("",data),null);
  assert.equal(buildMailto("bad\r\nBcc:other@example.com",data),null);
});
