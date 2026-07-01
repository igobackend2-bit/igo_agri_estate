import React from 'react';
import SEO from '../components/SEO';
import { motion } from 'framer-motion';
import { ShieldCheck, Target, Users, Landmark } from 'lucide-react';

interface AboutProps {
  /** false when this component is embedded as a section inside another page (e.g. the homepage),
   * so it doesn't emit a duplicate <h1>/SEO tags for that page. Defaults to true (standalone /about route). */
  standalone?: boolean;
}

const About: React.FC<AboutProps> = ({ standalone = true }) => {
  const Heading = standalone ? 'h1' : 'h2';
  return (
    <section id="about" className="py-20 bg-background">
      {standalone && (
        <SEO
          title="About IGO Agri Estates — India's Premier Agricultural Land Platform"
          description="IGO Agri Estates is India's premier institutional marketplace for managed farmland. 15+ years of expertise, 5000+ acres managed, clear title verification, and scientific crop planning across Tamil Nadu, Karnataka, Maharashtra, Andhra Pradesh & Telangana."
          canonical="/about"
          keywords="IGO Agri Estates about, agricultural land company India, farmland investment company India, agri estate company, managed farmland India, farm land developer Tamil Nadu Karnataka Maharashtra"
          ogImage="https://www.igoagriestate.com/images/team-expert-indian.png"
          schema={[
            {
              '@context': 'https://schema.org',
              '@type': 'AboutPage',
              name: "About IGO Agri Estates",
              url: 'https://www.igoagriestate.com/about',
              mainEntity: { '@id': 'https://www.igoagriestate.com/#organization' },
              description: "IGO Agri Estates is India's premier institutional marketplace for managed farmland, offering 15+ years of expertise, clear title verification, and scientific crop planning."
            },
            {
              '@context': 'https://schema.org',
              '@type': 'BreadcrumbList',
              itemListElement: [
                { '@type': 'ListItem', position: 1, name: 'Home', item: 'https://www.igoagriestate.com/' },
                { '@type': 'ListItem', position: 2, name: 'About', item: 'https://www.igoagriestate.com/about' }
              ]
            }
          ]}
        />
      )}
      <div className="container-pro">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto text-center mb-20"
        >
          <p className="text-[10px] font-black text-[#00814a] uppercase tracking-[0.5em] mb-6">Our Legacy</p>
          <Heading className="text-6xl font-black text-primary uppercase tracking-tighter leading-none mb-8">
            The Institution <br />of <span className="text-secondary italic font-serif">Agricultural Land</span>
          </Heading>
          <p className="text-xl text-text-muted font-light leading-relaxed">
            IGO Agriestates is India's premier institutional marketplace for managed farmland and agricultural real estate. We bridge the gap between traditional land ownership and modern investment excellence.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-16 items-center mb-32">
          <div className="space-y-8">
            <h2 className="text-4xl font-black text-primary uppercase tracking-tight">Our Mission</h2>
            <p className="text-text-muted leading-relaxed">
              To democratize agricultural land ownership by providing institutional-grade transparency, scientific agronomy support, and secure title management. We believe land is the ultimate asset, and our goal is to make it productive and profitable for every investor.
            </p>
            <div className="grid grid-cols-2 gap-6 pt-6">
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#00814a]">15+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Years Experience</div>
              </div>
              <div className="space-y-2">
                <div className="text-3xl font-black text-[#00814a]">5k+</div>
                <div className="text-[10px] font-black uppercase tracking-widest text-text-muted">Acres Managed</div>
              </div>
            </div>
          </div>
          <div className="rounded-[40px] overflow-hidden shadow-2xl h-[500px]">
             <img 
               src="/images/team-expert-indian.png" 
               alt="IGO Agri Estates expert team — agricultural land investment specialists in Tamil Nadu, India"
               className="w-full h-full object-cover"
             />
          </div>
        </div>

        <div className="grid md:grid-cols-4 gap-8 mb-32">
          {[
            { icon: <ShieldCheck className="text-secondary" />, title: 'Title Security', desc: 'Rigorous 30-year title verification for every asset.' },
            { icon: <Target className="text-secondary" />, title: 'Scientific ROI', desc: 'Data-driven crop projections and yield analysis.' },
            { icon: <Users className="text-secondary" />, title: 'Expert Support', desc: 'Dedicated agronomy and legal desks at your service.' },
            { icon: <Landmark className="text-secondary" />, title: 'Compliance', desc: 'Full adherence to state-specific agricultural laws.' }
          ].map((item, i) => (
            <div key={i} className="p-10 bg-white border border-black/5 rounded-[32px] hover:shadow-xl transition-all">
              <div className="mb-6">{item.icon}</div>
              <h3 className="text-lg font-black text-primary uppercase mb-3">{item.title}</h3>
              <p className="text-sm text-text-muted leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default About;
