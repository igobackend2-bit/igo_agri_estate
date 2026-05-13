import { Property } from '../types';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export const analyzeProperty = (property: Property, query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes('yield') || q.includes('roi') || q.includes('returns') || q.includes('profit')) {
    return `${property.title} can be reviewed as an agricultural estate with a ${property.roi} income view. IGO will check land size, water, soil, access, crop use, operating cost, buyer route, and market demand before discussing realistic earning potential.`;
  }
  
  if (q.includes('soil') || q.includes('farming') || q.includes('water') || q.includes('crop')) {
    return `For ${property.title}, IGO reviews soil, water source, access, power, climate, crop suitability, and current land use so the buyer understands how practical the estate is before purchase.`;
  }
  
  if (q.includes('legal') || q.includes('title') || q.includes('paper')) {
    return `Before a customer buys ${property.title}, IGO reviews the title chain, survey, tax records, water access, boundary clarity, and registration readiness. Legal clarity comes before token payment or sale closure.`;
  }

  return `I can help you understand ${property.title} as a buy/sell agricultural estate. Ask about land value, crop use, water, legal checks, site visit, or resale potential.`;
};

export const getGeneralAdvice = (query: string): string => {
  const q = query.toLowerCase();
  
  if (q.includes('how to invest') || q.includes('process') || q.includes('buy')) {
    return "IGO buy/sell flow: 1. Search Agri Estates or post your requirement. 2. Share location, budget, acreage, water, access, and land type. 3. IGO helps with site visit and seller connection. 4. Legal and land details are reviewed. 5. Buyer and seller move toward negotiation and closure.";
  }

  if (q.includes('my land') || q.includes('own land') || q.includes('sell land') || q.includes('post property')) {
    return "If you already own agricultural land, you can list it with IGO by sharing location, acreage, asking price, land type, water source, access road, title status, and photos. Clear information helps attract serious buyers faster.";
  }

  if (q.includes('polyhouse')) {
    return "Protected or polyhouse-ready estates need reliable water, power, road access, and clear land boundaries. Buyers usually review crop suitability, structure feasibility, and market access before purchase.";
  }

  if (q.includes('hydroponic') || q.includes('vertical') || q.includes('microgreen')) {
    return "Hydroponic, vertical, and microgreens-ready estates are usually compact spaces, rooftops, clean rooms, or urban parcels. Buyers should verify water quality, power backup, hygiene readiness, and local demand.";
  }

  if (q.includes('horticulture') || q.includes('plantation') || q.includes('orchard')) {
    return "Horticulture and plantation estates suit buyers looking for fruit crops, orchards, long-hold land value, and managed harvest potential. Soil, water, crop age, spacing, access, and title clarity matter most.";
  }

  if (q.includes('goat') || q.includes('livestock') || q.includes('dairy')) {
    return "Livestock or dairy-ready estates should be checked for shed space, fodder availability, water, caretaker access, veterinary access, road connectivity, and local sale channels.";
  }

  if (q.includes('na conversion') || q.includes('non-agricultural')) {
    return "NA conversion (Non-Agricultural) is the process of converting agricultural land for other uses. In states like Maharashtra and Karnataka, this involves Section 42 of the Land Revenue Code. IGO's legal desk can assist with collector permissions and town planning approvals.";
  }

  if (q.includes('karnataka') || q.includes('karnataka law')) {
    return "In Karnataka, the Land Reforms Act (Section 79A/B) was recently amended, allowing non-farmers to buy agricultural land. However, ceiling limits and specific district regulations still apply. Our regional experts can guide you through the latest RTC (Pahani) verification process.";
  }

  if (q.includes('maharashtra') || q.includes('maharashtra law')) {
    return "In Maharashtra, only a 'farmer' as defined by the Tenancy Act can typically buy agricultural land. Buyers should review eligibility, title, local rules, and any collector permission needs before proceeding.";
  }

  if (q.includes('tax') || q.includes('capital gains')) {
    return "Agricultural land sales are often exempt from capital gains tax under Section 2(14) of the Income Tax Act if the land is outside specified municipal limits. Additionally, Section 54-B offers relief for reinvesting in other agri-land. Consult our Tax Optimizer for a custom simulation.";
  }
  
  return "Hello! I can help you search Agri Estates, understand buying requirements, prepare a seller listing, review land details, or ask what makes an agricultural estate attractive to serious buyers.";
};
