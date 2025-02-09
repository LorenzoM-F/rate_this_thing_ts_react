function ScrollToTopButton() {
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <button className="scroll-to-top-button" onClick={scrollToTop}>
            ↑
        </button>
    );
}

export default ScrollToTopButton;