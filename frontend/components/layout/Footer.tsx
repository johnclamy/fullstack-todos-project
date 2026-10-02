export default function Footer() {
    const currentYear = new Date().getFullYear()

    return (
        <footer className="footer">
            <div className="footer-container">
                <p className="footer-text">
                    &copy; {currentYear} MyTodos. All rights reserved.
                </p>
                <div className="footer-links">
                    <a href="/privacy" className="footer-link">Privacy</a>
                    <a href="/terms" className="footer-link">Terms</a>
                </div>
            </div>
        </footer>
    )
}
