(()=>{
  'use strict';
  const partners=[
    {
      slug:'yorktown-tools',
      name:'Yorktown Tools',
      logo:'/assets/partners/yorktown-tools/logo.webp',
      logoAlt:'Yorktown Tools logo',
      offer:'10% OFF',
      offerLabel:'Military Discount',
      veteranOwned:true,
      directlyConfirmed:true,
      description:'Yorktown Tools directly confirmed a 10% military discount with Mission Rated. Featured placement highlights the partnership and benefit; it does not affect ratings or rankings.',
      featuredDescription:'Yorktown Tools stepped up with a direct 10% military discount for the community. They are a veteran-owned Hampton Roads supplier serving contractors, government agencies, and military installations, with free local job-site delivery.',
      businessUrl:'https://yorktowntools.com/',
      profileUrl:'/business.html?id=fa25b2da-995b-4318-9d97-05b185688f62',
      featuredUrl:'/featured',
      phone:'(757) 940-5171',
      location:'Yorktown, Virginia',
      verification:'Offer confirmed directly by Yorktown Tools on August 23, 2026.',
      terms:'Military eligibility required. Confirm final eligibility and any exclusions with Yorktown Tools at purchase or quote.'
    },
    {
      slug:'compass-rose-realty-co',
      name:'Compass Rose Realty Co.',
      logo:'',
      logoAlt:'Compass Rose Realty Co. logo',
      offer:'$100 OFF',
      offerLabel:'Home inspection',
      veteranOwned:false,
      directlyConfirmed:true,
      description:'Compass Rose Realty Co. stepped up to support servicemembers with a directly confirmed $100 discount on buyer home inspections or seller pre-listing home inspections. Their participation reflects exactly what Mission Rated is built to encourage: local businesses showing up for the military community with meaningful, practical value. Featured placement does not affect ratings or rankings.',
      featuredDescription:'Compass Rose Realty Co. is showing up for the military community with a directly confirmed Mission Rated offer: $100 off a home inspection for buyers or a pre-listing home inspection for sellers. Kristen Sessions and Compass Rose are helping make an expensive part of buying or selling a home a little easier for servicemembers, and we appreciate their willingness to support the community in a tangible way.',
      businessUrl:'https://www.compassroserealtyco.com/',
      profileUrl:'',
      featuredUrl:'/featured#compass-rose-realty-co',
      phone:'757-362-9125',
      location:'Chesapeake, Virginia',
      verification:'Offer confirmed directly by Kristen Sessions, Principal Broker & Owner of Compass Rose Realty, on August 23, 2026.',
      terms:'For servicemembers. $100 off home inspections for buyers or pre-listing home inspections for sellers. To redeem, tell Compass Rose Realty Co. you found the offer on Mission Rated.'
    }
  ];
  window.MRFeaturedPartners=Object.freeze({
    all:Object.freeze(partners),
    get(slug){return partners.find(partner=>partner.slug===slug)||null;}
  });
})();
