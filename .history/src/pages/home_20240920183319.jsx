import IntroductionSection from "../components/introductionSection"
import FeaturesOverview from "../components/featuresOverview"
import Recommendations from "../components/recommendations"
import CommonQuestions from "../components/commonQuestions"
import ContactUs from "../components/contactUs"

/**
 * Home component represents the landing page of the application.
 * It includes several sections: Introduction, Features, Recommendations,
 * Common Questions, and Contact Us.
 */
export default function Home() {
    return (
        <div>
            <IntroductionSection />
            <FeaturesOverview />
            <Recommendations />
            <CommonQuestions />
            <ContactUs />
        </div>
    )
}
