import IntroductionSection from "../components/introductionSection";
import FeaturesOverview from "../components/featuresOverview";
import Recommendations from "../components/recommendations";
import CommonQuestions from "../components/commonQuestions";
import ContactUs from "../components/contactUs";

export default function Home() {
  return (
    <div>
      <IntroductionSection />
      <FeaturesOverview />
      <Recommendations />
      <CommonQuestions />
      <ContactUs />
    </div>
  );
}
