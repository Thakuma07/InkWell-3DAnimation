import gsap from "gsap";

export function initMobile(state, config, components) {
    let lastTouchX = 0;
    let isTouching = false;
    const { parallaxState, transformState, cards } = state;
    const { mobileHint } = components;

    // Mobile touch events
    document.addEventListener("touchstart", (e) => {
        if (!config.isMoblie || state.isPreviewActive || state.isTransitioning) return;
        isTouching = true;
        lastTouchX = e.touches[0].clientX;

        if (mobileHint) gsap.to(mobileHint, { opacity: 0, duration: 0.5 });
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
        if (!isTouching || !config.isMoblie || state.isPreviewActive || state.isTransitioning) return;

        const touchX = e.touches[0].clientX;
        const deltaX = touchX - lastTouchX;
        lastTouchX = touchX;

        // Rotate the gallery based on horizontal swipe
        parallaxState.targetZ += deltaX * 0.2;
    }, { passive: true });

    document.addEventListener("touchend", () => {
        isTouching = false;
    });

    // Mobile update logic function to be called in the main animate loop
    return function updateMobile() {
        if (!config.isMoblie || state.isPreviewActive || state.isTransitioning) return;

        // Continuous rotation on mobile when not interacting
        if (!isTouching) {
            parallaxState.targetZ += 1; // Smooth slow rotation
        }

        // Automatic card flipping as they rotate through the front
        for (let i = 0; i < cards.length; i++) {
            const cardState = transformState[i];
            const cardAngleDeg = (cardState.angle * 180 / Math.PI);
            let totalAngle = (cardAngleDeg + parallaxState.currentZ) % 360;
            if (totalAngle < 0) totalAngle += 360;

            // Focus point is the bottom-center (90 degrees)
            let diff = Math.abs(totalAngle - 90);
            if (diff > 180) diff = 360 - diff;

            const threshold = 60; // Active zone for the flip effect
            if (diff < threshold) {
                const factor = Math.pow(1 - (diff / threshold), 1.5);
                cardState.targetRotation = 180 * factor;
                cardState.targetScale = 1 + 0.4 * factor;
                cardState.targetX = (config.cardMoveAmount * 0.5) * factor * cardState.cosAngle;
                cardState.targetY = (config.cardMoveAmount * 0.5) * factor * cardState.sinAngle;
                cardState.isAnimating = true;
            } else if (cardState.targetRotation !== 0) {
                cardState.targetRotation = 0;
                cardState.targetScale = 1;
                cardState.targetX = 0;
                cardState.targetY = 0;
                cardState.isAnimating = true;
            }
        }
    };
}
