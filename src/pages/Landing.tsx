
import React from 'react';
import { ArrowRight, Play, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import FloatingNavbar from '@/components/FloatingNavbar';
import { useZkLogin } from '../hooks/useZkLogin';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';

const Landing = () => {
  const { handleLogin } = useZkLogin();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard');
    }
  }, [isAuthenticated, navigate]);

  const handleGetStarted = async () => {
    try {
      await handleLogin();
    } catch (error) {
      console.error('Failed to login:', error);
    }
  };
  const stats = [
    { number: "50K+", label: "Active Learners" },
    { number: "15K+", label: "Expert Tutors" },
    { number: "98%", label: "Trust Rating" },
    { number: "1M+", label: "XP Distributed" }
  ];

  const howItWorksCards = [
    {
      icon: <img src="/image/more than courses its an open vault.gif" className="h-8 w-8" alt="Learn Today" />,
      title: "Learn Today",
      description: "Access peer-to-peer learning sessions and contribute to the knowledge vault"
    },
    {
      icon: <img src="/image/verified skills.png" className="h-8 w-8" alt="Teach Tomorrow" />,
      title: "Teach Tomorrow", 
      description: "Share your expertise and earn XP while helping others grow"
    },
    {
      icon: <img src="/image/education-that-feeds-itself.png" className="h-8 w-8" alt="Intense Sessions" />,
      title: "Intense Sessions",
      description: "Participate in focused learning experiences with real-time collaboration"
    },
    {
      icon: <img src="/image/we don't just learn we govern.png" className="h-8 w-8" alt="Soulbound Certificates" />,
      title: "Soulbound Certificates",
      description: "Earn verified, blockchain-based credentials that stay with you forever"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-950 text-white overflow-hidden">
      <FloatingNavbar />
      
      {/* Hero Section with Background Video */}
      <section id="home" className="relative h-screen flex items-center justify-center">
        {/* Background Video */}
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover opacity-20"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950/70 via-transparent to-gray-950/90" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto px-4 animate-fade-in">
          <h1 className="text-6xl md:text-8xl font-bold mb-6 bg-gradient-to-r from-blue-400 via-purple-400 to-blue-400 bg-clip-text text-transparent leading-tight">
            Pay for Knowledge<br />with Knowledge
          </h1>
          <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
            The first decentralized learning platform where your expertise becomes currency and knowledge flows freely across Africa and beyond
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 text-lg"
              onClick={handleGetStarted}
            >
              Get Started <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-gray-600 text-black hover:bg-gray-800 px-8 py-4 text-lg">
              <Play className="mr-2 h-5 w-5" /> Watch Demo
            </Button>
          </div>
        </div>

        {/* Floating Elements */}
        <div className="absolute top-20 left-10 w-20 h-20 border border-blue-500/30 rounded-full animate-pulse" />
        <div className="absolute bottom-20 right-10 w-16 h-16 border border-purple-500/30 rounded-full animate-pulse delay-300" />
        <div className="absolute top-1/3 right-1/4 w-12 h-12 border border-blue-500/30 rounded-full animate-pulse delay-700" />
      </section>

      {/* Fluid Shape Divider */}
      <div className="relative">
        <svg
          className="absolute top-0 left-0 w-full h-24 fill-current text-gray-900"
          viewBox="0 0 1200 120"
          preserveAspectRatio="none"
        >
          <path d="M0,0V46.29c47.79,22.2,103.59,32.17,158,28,70.36-5.37,136.33-33.31,206.8-37.5C438.64,32.43,512.34,53.67,583,72.05c69.27,18,138.3,24.88,209.4,13.08,36.15-6,69.85-17.84,104.45-29.34C989.49,25,1113-14.29,1200,52.47V0Z"
            opacity=".25"
          />
          <path d="M0,0V15.81C13,36.92,27.64,56.86,47.69,72.05,99.41,111.27,165,111,224.58,91.58c31.15-10.15,60.09-26.07,89.67-39.8,40.92-19,84.73-46,130.83-49.67,36.26-2.85,70.9,9.42,98.6,31.56,31.77,25.39,62.32,62,103.63,73,40.44,10.79,81.35-6.69,119.13-24.28s75.16-39,116.92-43.05c59.73-5.85,113.28,22.88,168.9,38.84,30.2,8.66,59,6.17,87.09-7.5,22.43-10.89,48-26.93,60.65-49.24V0Z"
            opacity=".5"
          />
          <path d="M0,0V5.63C149.93,59,314.09,71.32,475.83,42.57c43-7.64,84.23-20.12,127.61-26.46,59-8.63,112.48,12.24,165.56,35.4C827.93,77.22,886,95.24,951.2,90c86.53-7,172.46-45.71,248.8-84.81V0Z" />
        </svg>
      </div>

      {/* Trust and Credibility Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">Trusted by Thousands</h2>
          <p className="text-gray-400 mb-12 text-lg">Join Africa's fastest-growing learning community</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="animate-fade-in" style={{ animationDelay: `${index * 200}ms` }}>
                <div className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                  {stat.number}
                </div>
                <div className="text-gray-400 mt-2">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* What is PeerVerse Section */}
      <section id="about" className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="animate-fade-in">
              <h2 className="text-5xl font-bold mb-6">Education that Feeds Itself</h2>
              <p className="text-gray-400 text-lg mb-6">
                PeerVerse is a revolutionary decentralized learning platform where knowledge becomes currency. 
                Every interaction, every lesson shared, every skill learned contributes to a self-sustaining 
                ecosystem of growth and opportunity.
              </p>
              <p className="text-gray-400 text-lg">
                Built on blockchain technology, we ensure transparent, verifiable, and permanent recognition 
                of your learning journey while connecting you with peers across Africa and beyond.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-lg border border-blue-500/30 flex items-center justify-center">
                <img src="/image/education-that-feeds-itself.png" className="animate-pulse" alt="Education" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section id="features" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto text-center">
          <div className="grid lg:grid-cols-4 gap-8">
            {howItWorksCards.map((card, index) => (
              <Card key={index} className="bg-gray-800 border-gray-700 hover:border-blue-500/50 transition-all duration-300 hover:scale-105">
                <CardContent className="p-6 text-center">
                  <div className="text-blue-400 mb-4 flex justify-center">
                    {card.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3 text-white">{card.title}</h3>
                  <p className="text-gray-400">{card.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* XP Economy Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">The New Currency of Learning</h2>
          <p className="text-gray-400 text-lg mb-12">
            Experience Points (XP) power our entire ecosystem. Contribute knowledge, earn XP. 
            Stay inactive, watch it diminish. It's knowledge economics in action.
          </p>
          
          {/* XP Progress Bar Demo */}
          <div className="max-w-2xl mx-auto mb-12">
            <div className="bg-gray-800 rounded-lg p-8">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">Your XP Balance</span>
                <span className="text-blue-400 font-bold text-xl">2,847 XP</span>
              </div>
              <div className="w-full bg-gray-700 rounded-full h-4 mb-4">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 h-4 rounded-full animate-pulse" style={{ width: '68%' }}></div>
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="text-green-400">
                  <img src="/image/verified skills.png" className="inline h-4 w-4 mr-1" alt="Teaching" />
                  +150 XP from teaching
                </div>
                <div className="text-blue-400">
                  <img src="/image/fair-compensation.png" className="inline h-4 w-4 mr-1" alt="Learning" />
                  +50 XP from learning
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Marketplace and Vault Section */}
      <section className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-purple-500/20 to-blue-500/20 rounded-lg border border-purple-500/30 flex items-center justify-center">
                <img src="/image/more than courses its an open vault.gif" className="h-32 w-32 animate-pulse" alt="Open Vault" />
              </div>
            </div>
            <div>
              <h2 className="text-5xl font-bold mb-6">More Than Courses, It's an Open Knowledge Vault</h2>
              <p className="text-gray-400 text-lg mb-6">
                Our marketplace isn't just about buying and selling courses. It's a living, breathing 
                knowledge vault where every resource is community-curated, peer-reviewed, and continuously updated.
              </p>
              <p className="text-gray-400 text-lg">
                From quick tutorials to comprehensive courses, from rare insights to common wisdom - 
                everything has value in our economy of knowledge.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Talent Network Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Hire From Within or Be Hired From Within</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-3xl mx-auto">
            Our talent network creates opportunities for skilled individuals to find work and for 
            organizations to discover exceptional talent, all verified through our platform's 
            transparent reputation system.
          </p>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <img src="/image/verified skills.png" className="h-12 w-12 mx-auto mb-4" alt="Verified Skills" />
                <h3 className="text-xl font-semibold mb-3 text-white">Verified Skills</h3>
                <p className="text-gray-400">Every skill is backed by verifiable learning history and peer validation</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <img src="/image/transparent-reputation.png" className="h-12 w-12 mx-auto mb-4" alt="Transparent Reputation" />
                <h3 className="text-xl font-semibold mb-3 text-white">Transparent Reputation</h3>
                <p className="text-gray-400">Build your reputation through teaching, learning, and community contribution</p>
              </CardContent>
            </Card>
            <Card className="bg-gray-800 border-gray-700">
              <CardContent className="p-6 text-center">
                <img src="/image/fair-compensation.png" className="h-12 w-12 mx-auto mb-4" alt="Fair Compensation" />
                <h3 className="text-xl font-semibold mb-3 text-white">Fair Compensation</h3>
                <p className="text-gray-400">XP-based payment system ensures fair value for knowledge and skills</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Community DAO Section */}
      <section id="community" className="py-20 px-4 bg-gray-900">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-5xl font-bold mb-6">We Don't Just Learn, We Govern</h2>
              <p className="text-gray-400 text-lg mb-6">
                PeerVerse is powered by a community DAO where every stakeholder has a voice. 
                From course content approval to platform development decisions, our community 
                shapes the future of decentralized learning.
              </p>
              <p className="text-gray-400 text-lg">
                Your XP doesn't just buy knowledge - it gives you voting power to influence 
                the direction of the platform and ensure it serves the community's needs.
              </p>
            </div>
            <div className="relative">
              <div className="w-full h-80 bg-gradient-to-br from-green-500/20 to-blue-500/20 rounded-lg border border-green-500/30 flex items-center justify-center">
                <img src="/image/we don't just learn we govern.png" className="h-32 w-32 animate-pulse" alt="Governance" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Africa First Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h2 className="text-5xl font-bold mb-6">Built for Africa. Designed for the World</h2>
          <p className="text-gray-400 text-lg mb-12 max-w-4xl mx-auto">
            Africa is home to the world's youngest and fastest-growing population, yet access to quality 
            education remains a challenge. PeerVerse starts here because the need is greatest and the 
            potential is limitless. What works for Africa works for everyone.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <img src="/image/global-reach.png" className="h-16 w-16 mx-auto mb-4" alt="Global Reach" />
              <h3 className="text-xl font-semibold text-white mb-2">Global Reach</h3>
              <p className="text-gray-400">Connect with learners worldwide</p>
            </div>
            <div className="text-center">
              <img src="/image/local-impact.png" className="h-16 w-16 mx-auto mb-4" alt="Local Impact" />
              <h3 className="text-xl font-semibold text-white mb-2">Local Impact</h3>
              <p className="text-gray-400">Solve Africa's education challenges</p>
            </div>
            <div className="text-center">
              <img src="/image/verified skills.png" className="h-16 w-16 mx-auto mb-4" alt="Economic Growth" />
              <h3 className="text-xl font-semibold text-white mb-2">Economic Growth</h3>
              <p className="text-gray-400">Create opportunities and wealth</p>
            </div>
            <div className="text-center">
              <img src="/image/education-that-feeds-itself.png" className="h-16 w-16 mx-auto mb-4" alt="Knowledge Bridge" />
              <h3 className="text-xl font-semibold text-white mb-2">Knowledge Bridge</h3>
              <p className="text-gray-400">Bridge the global knowledge gap</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-gradient-to-r from-blue-900 via-purple-900 to-blue-900">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-6xl font-bold mb-6">Africa's Learning Revolution Starts with You</h2>
          <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
            Join thousands of learners, teachers, and innovators who are reshaping the future of education. 
            Your knowledge has value. Your potential has no limits.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button 
              size="lg" 
              className="bg-white text-black hover:bg-gray-100 px-8 py-4 text-lg font-semibold"
              onClick={handleGetStarted}
            >
              Get Started <Rocket className="ml-2 h-5 w-5" />
            </Button>
            <Button size="lg" variant="outline" className="border-white text-black hover:bg-black hover:text-white px-8 py-4 text-lg">
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 bg-gray-950 border-t border-gray-800">
        <div className="max-w-6xl mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
            PeerVerse
          </h3>
          <p className="text-gray-400 mb-6">Decentralized Learning. Verified Knowledge. Infinite Possibilities.</p>
          <div className="text-gray-500 text-sm">
            © 2025 PeerVerse. From Michadek23 For the Sui Buildathon PortHarcourt.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
