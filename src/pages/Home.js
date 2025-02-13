import HeroSection from "../components/Herosection";
import Gallery from "../components/Gallery";
import WildlifeSanctuary from "../components/Wildlifesanctuary";
import ServicesList from "../components/Services";

function Home() {
  return (
    <div>
      <HeroSection />
      <Gallery />
      <WildlifeSanctuary />
      <ServicesList />
    </div>
  );
}

export default Home;