import { render } from "preact"
import { App } from "./app.jsx" // ייבוא של הקומפוננטה הראשית
import "./index.css" // ייבוא של קובץ ה-CSS

// רנדרינג של הקומפוננטה הראשית לתוך האלמנט עם id="app"
render(<App />, document.getElementById("app"))
