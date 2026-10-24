export const emptyEnquiry = { fullName:"",contactMethod:"Email",email:"",phone:"",website:"",projectType:"",location:"",description:"",area:"",requirements:"",scope:"",style:"",materials:"",inspiration:"" };
export type Enquiry = typeof emptyEnquiry;
export type EnquiryErrors = Partial<Record<keyof Enquiry,string>>;
export const projectTypes = ["Residence","Interior","Hospitality","Workspace","Landscape","Other"];
export const scopes = ["New build","Renovation","Interior fit-out","Landscape","Full project coordination"];
export const styles = ["Contemporary minimal","Warm minimalism","Brutalist","Tropical modern","Japanese-inspired","Open to exploration"];
export const enquirySteps = ["Contact","Project","Space","Style","Review"];
export const stepFields: { title: string; fields: [keyof Enquiry,string][] }[] = [
  { title:"Contact",fields:[["fullName","Full name"],["contactMethod","Preferred contact"],["email","Email"],["phone","Phone / WhatsApp"],["website","Website"]] },
  { title:"Project",fields:[["projectType","Project type"],["location","Project location"],["description","Project description"]] },
  { title:"Space",fields:[["area","Estimated area (m2)"],["requirements","Space requirements"],["scope","Project scope"]] },
  { title:"Style",fields:[["style","Architectural style"],["materials","Material preferences"],["inspiration","Inspiration notes"]] },
];
const emailPattern = /^[^\s@\r\n]+@[^\s@\r\n]+\.[^\s@\r\n]+$/;
export function validateStep(step: number, data: Enquiry): EnquiryErrors {
  const errors: EnquiryErrors = {};
  const required = (field: keyof Enquiry,label: string) => { if (!data[field].trim()) errors[field] = `Please enter ${label}.`; };
  if (step === 0) {
    required("fullName","your full name");
    if (!["Email","WhatsApp"].includes(data.contactMethod)) errors.contactMethod="Choose a contact method.";
    if (data.contactMethod === "Email") required("email","your email address");
    if (data.contactMethod === "WhatsApp") required("phone","your WhatsApp number");
    if (data.email && !emailPattern.test(data.email.trim())) errors.email="Enter a valid email address.";
    if (data.phone && (!/^[+\d\s().-]+$/.test(data.phone) || !/^\d{7,15}$/.test(data.phone.replace(/\D/g,"")))) errors.phone="Enter a phone number with 7 to 15 digits.";
    if (data.website) { try { const url=new URL(data.website); if (!["https:","http:"].includes(url.protocol)) throw new Error(); } catch { errors.website="Enter a complete http:// or https:// website address."; } }
  }
  if (step === 1) {
    if (!projectTypes.includes(data.projectType)) errors.projectType="Choose a project type.";
    required("location","the project location"); required("description","a short project description");
  }
  if (step === 2) {
    if (!data.area.trim() || !Number.isFinite(Number(data.area)) || Number(data.area)<=0 || Number(data.area)>1000000) errors.area="Enter an estimated area between 0 and 1,000,000 m2.";
    required("requirements","your space requirements");
    if (!scopes.includes(data.scope)) errors.scope="Choose a project scope.";
  }
  if (step === 3 && !styles.includes(data.style)) errors.style="Choose a style direction.";
  for (const [field] of stepFields[step]?.fields ?? []) {
    const max = ["description","requirements","inspiration"].includes(field)?1200:field==="materials"?500:200;
    if (data[field].length>max) errors[field]=`Please keep this under ${max} characters.`;
  }
  return errors;
}
export function enquirySummary(data: Enquiry) {
  return ["ATELIER ARVENA / PROJECT ENQUIRY",...stepFields.map(section=>`${section.title.toUpperCase()}\n${section.fields.filter(([field])=>data[field].trim()).map(([field,label])=>`${label}: ${data[field].trim()}`).join("\n")}`)].join("\n\n");
}
export function buildMailto(recipient: string, data: Enquiry) {
  if (!emailPattern.test(recipient)) return null;
  return `mailto:${recipient}?subject=${encodeURIComponent(`Project enquiry - ${data.projectType || "Atelier Arvena"}`)}&body=${encodeURIComponent(enquirySummary(data))}`;
}
