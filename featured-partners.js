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
      description:'Compass Rose Realty Co. directly confirmed a $100 servicemember discount with Mission Rated for buyer home inspections or seller pre-listing home inspections. Featured placement does not affect ratings or rankings.',
      featuredDescription:'Compass Rose Realty Co. directly confirmed this Mission Rated offer for servicemembers: $100 off a home inspection for buyers or a pre-listing home inspection for sellers.',
      businessUrl:'https://www.compassroserealtyco.com/',
      profileUrl:'',
      featuredUrl:'/featured#compass-rose-realty-co',
      phone:'',
      location:'',
      verification:'Offer confirmed directly by Compass Rose Realty Co. on August 23, 2026.',
      terms:'For servicemembers. $100 off home inspections for buyers or pre-listing home inspections for sellers. To redeem, tell Compass Rose Realty Co. you found the offer on Mission Rated.'
    }
  ];
  window.MRFeaturedPartners=Object.freeze({
    all:Object.freeze(partners),
    get(slug){return partners.find(partner=>partner.slug===slug)||null;}
  });
})();
