import { useEffect } from "react";
import { useLocation } from "react-router-dom";

export default function ScrollToTop() {
    const { pathname } = useLocation();

    useEffect(() => {
        // Only scroll to top if not a hash link
        if (!window.location.hash) {
            window.scrollTo(0, 0);
        }
    }, [pathname]);

    return null;
}
