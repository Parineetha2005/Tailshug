import founderGarimaImg from '../assets/images/founder_garima_bekky_1791797256212.jpg';
import heroPetCareImg from '../assets/images/hero_pet_care_1791797270919.jpg';
import groomingSpaImg from '../assets/images/service_grooming_spa_1791797281876.jpg';
import vetHealthImg from '../assets/images/service_vet_health_1791797293227.jpg';
import boardingDaycareImg from '../assets/images/service_boarding_resort_1792170154051.jpg';
import trainingImg from '../assets/images/service_pet_training_1792170154792.jpg';
import adoptionImg from '../assets/images/service_pet_adoption_1792170154740.jpg';
import transportImg from '../assets/images/service_pet_transport_1792170155238.jpg';
import recreationImg from '../assets/images/service_pet_recreation_1792170155708.jpg';
import suppliesImg from '../assets/images/service_pet_supplies_1792170155221.jpg';
import techImg from '../assets/images/service_smart_pet_tech_1792170157183.jpg';
import memorialImg from '../assets/images/service_pet_memorial_1792170156937.jpg';
import artsImg from '../assets/images/service_pet_photography_1792170157876.jpg';
import ambulanceImg from '../assets/images/service_pet_ambulance_1792170157027.jpg';

export const BRAND_ASSETS = {
  logo: '/horizontal-logo.png',
  favicon: '/favicon.png',
  appShowcaseDesktop: '/banner-right-image.png',
  appShowcaseMobile: '/mobile-banner.png',
  founderDefaultPhoto: founderGarimaImg,
  heroBanner: heroPetCareImg,
  groomingBanner: groomingSpaImg,
  vetBanner: vetHealthImg,
  boardingBanner: boardingDaycareImg,
};

export const INITIAL_SITE_CONFIG = {
  website: 'https://www.tailshug.com/',
  phone: '+91 93539 78831',
  phoneRaw: '+919353978831',
  email: 'care@tailshug.com',
  supportEmail: 'support@tailshug.com',
  privacyEmail: 'tailshug25@gmail.com',
  location: 'Bengaluru, India',
  playStoreUrl: 'https://play.google.com/store/search?q=TailsHug&c=apps',
  appStoreUrl: 'https://apps.apple.com/in/search?term=TailsHug',
};

export interface ServiceCategory {
  slug: string;
  number: string;
  title: string;
  shortDescription: string;
  longDescription: string;
  subcategories: string[];
  featuredImage?: string;
  requiredDocs: string[];
  sampleQueries: string[];
}

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    slug: 'health',
    number: '01',
    title: 'Health',
    shortDescription: 'Trusted veterinary clinics, routine vaccinations, preventive wellness, and comprehensive pet insurance.',
    longDescription:
      'Connect with licensed veterinarians, diagnostic centres, preventive vaccination clinics, and transparent pet health insurance advisors to safeguard every stage of your pet’s life.',
    subcategories: ['Veterinary care', 'Vaccination', 'Pet insurance', 'Pet Ambulance', 'Emergency triage'],
    featuredImage: vetHealthImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Veterinary Council Registration (VCI / State VC) or IRDAI License'],
    sampleQueries: ['Veterinary clinics in Indiranagar', 'Emergency veterinary clinics in Bengaluru', 'Pet vaccination clinic Koramangala'],
  },
  {
    slug: 'grooming-and-hygiene',
    number: '02',
    title: 'Grooming & Hygiene',
    shortDescription: 'Gentle breed-specific styling, warm medicated baths, coat conditioning, and preventive dental care.',
    longDescription:
      'Stress-free salon and home-visit grooming tailored to your dog or cat’s coat, skin sensitivity, and comfort—using pet-safe botanical shampoos and sanitized equipment.',
    subcategories: ['Grooming', 'Bathing', 'Dental care', 'Hygiene maintenance'],
    featuredImage: groomingSpaImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Grooming Certification or Salon Trade License'],
    sampleQueries: ['Dog groomers in Bengaluru', 'Cat grooming studio Indiranagar', 'Pet dental care Whitefield'],
  },
  {
    slug: 'boarding-and-daycare',
    number: '03',
    title: 'Boarding & Daycare',
    shortDescription: 'Cage-free home boarding, supervised social daycare, and trusted in-home pet sitting while you travel.',
    longDescription:
      'Real homes and thoughtfully designed boarding spaces where pets stick to their feeding schedule, enjoy supervised play, and send you daily photo and video updates.',
    subcategories: ['Boarding', 'Daycare', 'Pet sitting', 'Home stays'],
    featuredImage: boardingDaycareImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Address Proof & Facility Safety Photos'],
    sampleQueries: ['Pet boarding near Whitefield', 'Pet daycare in HSR Layout', 'Home cat sitter Indiranagar'],
  },
  {
    slug: 'training-and-behaviour',
    number: '04',
    title: 'Training & Behaviour',
    shortDescription: 'Positive-reinforcement obedience training, puppy socialization, and certified behaviour counselling.',
    longDescription:
      'Build lasting trust and calm communication with force-free trainers and canine/feline behaviourists who address leash reactivity, separation anxiety, and foundational manners.',
    subcategories: ['Obedience training', 'Behaviour counselling', 'Puppy socialization', 'Agility & trick training'],
    featuredImage: trainingImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Canine/Feline Trainer Certification or Portfolio'],
    sampleQueries: ['Dog trainers in Koramangala', 'Puppy behaviour counselling Bengaluru'],
  },
  {
    slug: 'pet-adoption',
    number: '05',
    title: 'Pet Adoption',
    shortDescription: 'Ethical animal rescue organisations, loving foster home networks, and missing-pet recovery support.',
    longDescription:
      'Support community-first animal welfare across India. Adopt vaccinated indie puppies and kittens, volunteer as a foster parent, or coordinate rapid neighbourhood alerts for missing pets.',
    subcategories: ['Pet adoption', 'Rescue organisations', 'Foster homes', 'Missing-pet recovery'],
    featuredImage: adoptionImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'NGO / Trust Registration or Rescue Reference'],
    sampleQueries: ['Animal rescue organisations in Chennai', 'Pet adoption centre Bengaluru'],
  },
  {
    slug: 'pet-transport',
    number: '06',
    title: 'Pet Transport',
    shortDescription: 'Sanitized AC pet taxis, local clinic transfers, emergency ambulance, and outstation pet relocation.',
    longDescription:
      'Dedicated pet-friendly rides with trained handlers for routine vet visits, airport transfers, railway escorts, emergency ambulance transfers, and door-to-door pet relocation across India.',
    subcategories: ['Pet Ambulance', 'Pet taxis', 'Local transportation', 'Outstation pet transport', 'Airport relocation'],
    featuredImage: transportImg,
    requiredDocs: ['Government ID & Driving License', 'Commercial Vehicle RC & Pet Safety Partition Details'],
    sampleQueries: ['Pet ambulance Bengaluru', 'Pet taxis in Bengaluru', 'Outstation pet transport India'],
  },
  {
    slug: 'recreation-and-exercise',
    number: '07',
    title: 'Recreation & Exercise',
    shortDescription: 'Hydrotherapy & canine swimming pools, GPS-tracked daily dog walking, and curated pet social events.',
    longDescription:
      'Keep your companions physically active and mentally enriched with reliable neighbourhood dog walkers, clean canine swimming pools, and weekend community pet meetups.',
    subcategories: ['Swimming', 'Dog walking', 'Recreation & agility', 'Pet events'],
    featuredImage: recreationImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Background Verification Consent'],
    sampleQueries: ['Dog swimming pool Bengaluru', 'Daily dog walker Jayanagar'],
  },
  {
    slug: 'pet-supplies',
    number: '08',
    title: 'Pet supplies',
    shortDescription: 'Curated neighbourhood pet boutiques, freshly prepared nutrition, and custom engraved pet accessories.',
    longDescription:
      'Discover independent pet boutiques crafting wholesome treats, orthopedic beds, custom embroidered harnesses, and personalized ID tags made for Indian weather and breeds.',
    subcategories: ['Pet supplies', 'Pet food & nutrition', 'Pet boutiques', 'Custom products'],
    featuredImage: suppliesImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'GSTIN or Shop Establishment Certificate (if applicable)'],
    sampleQueries: ['Pet boutiques in Bengaluru', 'Custom pet accessories Indiranagar'],
  },
  {
    slug: 'technology-and-apps',
    number: '09',
    title: 'Technology & Apps',
    shortDescription: 'GPS collar tracking devices, two-way interactive pet cameras, and smart automated feeders.',
    longDescription:
      'Stay connected with your furry family from anywhere using smart GPS trackers, HD treat-dispensing pet-cams, and app-controlled hydration fountains and feeders.',
    subcategories: ['Tracking devices', 'Pet cameras', 'Smart feeders and water bowls', 'Health monitoring apps'],
    featuredImage: techImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Product Warranty & Authorized Dealer Details'],
    sampleQueries: ['GPS pet tracker India', 'Smart pet camera retailer Bengaluru'],
  },
  {
    slug: 'memorial-services',
    number: '10',
    title: 'Memorial Services',
    shortDescription: 'Dignified cremation and burial grounds, compassionate pet hospice, gentle euthanasia, and grief counselling.',
    longDescription:
      'Honouring a lifetime of unconditional love with compassionate end-of-life palliative hospice care, peaceful cremation and burial arrangements, and empathetic pet bereavement support.',
    subcategories: ['Cremation and burial', 'Pet hospice', 'Euthanasia services', 'Grief counselling'],
    featuredImage: memorialImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Municipal / Facility Authorization or Counseling Credentials'],
    sampleQueries: ['Pet cremation services Bengaluru', 'Pet grief counselling India'],
  },
  {
    slug: 'arts-and-photos',
    number: '11',
    title: 'Arts & Photos',
    shortDescription: 'Professional outdoor & studio pet photography, fine-art portraits, and custom hand-painted keepsakes.',
    longDescription:
      'Capture your pet’s unmistakable personality with patient pet photographers, oil and watercolour portrait artists, and bespoke sculptural keepsakes.',
    subcategories: ['Pet photography', 'Portraits', 'Custom artwork', 'Event photography'],
    featuredImage: artsImg,
    requiredDocs: ['Government ID (Aadhaar / PAN)', 'Portfolio Link or Sample Work'],
    sampleQueries: ['Pet photographers in Mysuru', 'Pet portrait artist Bengaluru'],
  },
  {
    slug: 'pet-ambulance',
    number: '12',
    title: 'Pet Ambulance',
    shortDescription: '24/7 Emergency pet ambulance dispatch with on-board oxygen, critical care transport, and trained veterinary paramedics.',
    longDescription:
      'Rapid-response 24/7 pet ambulance services across Bengaluru and pan-India. Equipped with specialized canine/feline stretchers, medical oxygen concentrators, trauma kits, and compassionate veterinary paramedics ready when your pet needs emergency care most.',
    subcategories: ['24/7 Pet Ambulance', 'Emergency Care Transport', 'Oxygen Support On-Wheels', 'Critical Clinic Transfers', 'First Aid On-Wheels'],
    featuredImage: ambulanceImg,
    requiredDocs: ['Government ID & Driving License', 'Emergency Ambulance Vehicle Fitness & Veterinary Equipment Certification'],
    sampleQueries: ['24/7 pet ambulance Bengaluru', 'Emergency dog ambulance near me', 'Cat critical care transport Indiranagar'],
  },
];

export interface MarketplaceProvider {
  id: string;
  ownerId: string;
  businessName: string;
  categorySlug: string;
  categoryTitle: string;
  subcategories: string[];
  description: string;
  city: string;
  area: string;
  address: string;
  pincode: string;
  publicPhone: string;
  publicEmail: string;
  website?: string;
  startingPriceInr: number;
  servicesOffered: {
    name: string;
    subcategory: string;
    priceInr: number;
    durationMinutes: number;
    description: string;
  }[];
  operatingHours: string;
  cancellationPolicy: string;
  experienceYears: number;
  coverImage?: string;
  verified: boolean;
  status: 'pending' | 'approved' | 'rejected';
  ratingAvg: number;
  reviewCount: number;
}
