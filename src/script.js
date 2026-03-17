import gsap from "gsap";
import SplitType from "split-type";
import collection from "./collection.js";

document.addEventListener("DOMContentLoaded", () => {

    const gallery = document.querySelector(".gallery");
    const galleryContainer = document.querySelector(".gallery-container");
    const titleContainer = document.querySelector(".title-container");

    const cards = [];
    const transformState = [];

    let currentTitle = null;
    let isPreviewActive = false;
    let isTransitioning = false;

    const config = {
        imageCount: 25,
        radius: 275,
        sensitivity: 500,
        effectFalloff: 250,
        cardMoveAmount: 50,
        lerpFactor: 0.15,
        isMoblie: window.innerWidth < 1000,
        galleryScale: 1,
        sensitivitySq: 500 * 500, // Pre-calculate squared sensitivity
    };

    let lastMouseMoveTime = 0;

    const parallaxState = {
        targetX: 0,
        targetY: 0,
        targetZ: 0,
        currentX: 0,
        currentY: 0,
        currentZ: 0,
    };

    for (let i = 0; i < config.imageCount; i++) {
        const angle = (i / config.imageCount) * Math.PI * 2;
        const x = config.radius * Math.cos(angle);
        const y = config.radius * Math.sin(angle);
        const cardIndex = i % 20;

        const card = document.createElement("div");
        card.className = "card";
        card.dataset.index = i;
        card.dataset.title = collection[cardIndex].title;

        const img = document.createElement("img");
        img.src = collection[cardIndex].img;
        card.appendChild(img);

        gsap.set(card, {
            x,
            y,
            rotation: (angle * 180) / Math.PI + 90,
            transformPerspective: 800,
            transformOrigin: "center center",
        });

        const cosAngle = Math.cos(angle);
        const sinAngle = Math.sin(angle);

        gallery.appendChild(card);
        cards.push(card);
        transformState.push({
            currentRotation: 0,
            targetRotation: 0,
            currentX: 0,
            targetX: 0,
            currentY: 0,
            targetY: 0,
            currentScale: 1,
            targetScale: 1,
            angle,
            cosAngle,
            sinAngle,
            baseRotation: (angle * 180) / Math.PI + 90,
            baseX: x,
            baseY: y,
            isAnimating: false
        });

        card.addEventListener("click", (e) => {
            if (!isPreviewActive && !isTransitioning) {
                togglePreview(parseInt(card.dataset.index));
                e.stopPropagation();
            }
        });
    }

    function togglePreview(index) {
        isPreviewActive = true;
        isTransitioning = true;

        const angle = transformState[index].angle;
        const targetPosition = (Math.PI * 3) / 2;
        let rotationRadians = targetPosition - angle;

        if (rotationRadians > Math.PI) rotationRadians -= Math.PI * 2;
        else if (rotationRadians < -Math.PI) rotationRadians += Math.PI * 2;

        transformState.forEach((state) => {
            state.currentRotation = state.targetRotation = 0;
            state.currentScale = state.targetScale = 1;
            state.currentX = state.targetX = state.currentY = state.targetY = 0;
        });

        gsap.to(gallery, {
            onStart: () => {
                cards.forEach((card, i) => {
                    gsap.to(card, {
                        x: config.radius * Math.cos(transformState[i].angle),
                        y: config.radius * Math.sin(transformState[i].angle),
                        rotationY: 0,
                        scale: 1,
                        duration: 1.25,
                        ease: "power4.out",
                    });
                });
            },
            scale: 5,
            y: 1300,
            rotation: (rotationRadians * 180) / Math.PI + 360,
            duration: 2,
            ease: "power4.inOut",
            onComplete: () => (isTransitioning = false),
        });

        gsap.to(parallaxState, {
            currentX: 0,
            currentY: 0,
            currentZ: 0,
            duration: 0.5,
            ease: "power2.out",
            onUpdate: () => {
                gsap.set(galleryContainer, {
                    rotateX: parallaxState.currentX,
                    rotateY: parallaxState.currentY,
                    rotateZ: parallaxState.currentZ,
                    transformOrigin: "center center",
                });
            },
        });

        const titleText = cards[index].dataset.title;
        const p = document.createElement("p");
        p.textContent = titleText;
        titleContainer.appendChild(p);
        currentTitle = p;

        const splitText = new SplitType(p, {
            types: "words",
            wordClass: "word",
        });

        const words = splitText.words;

        gsap.set(words, { y: "125%" });
        gsap.to(words, {
            y: "0%",
            duration: 0.75,
            delay: 1.25,
            stagger: 0.1,
            ease: "power4.out",
        });
    }

    function resetGallery() {
        if (isTransitioning) return;

        isTransitioning = true;

        if (currentTitle) {
            const words = currentTitle.querySelectorAll(".word");
            gsap.to(words, {
                y: "-125%",
                duration: 0.75,
                delay: 0.5,
                stagger: 0.1,
                ease: "power4.out",
                onComplete: () => {
                    currentTitle.remove();
                    currentTitle = null;
                },
            });
        }

        const viewportWidth = window.innerWidth;
        let galleryScale = 1;

        if (viewportWidth < 768) {
            galleryScale = 0.6;
        } else if (viewportWidth < 1200) {
            galleryScale = 0.8;
        }

        gsap.to(gallery, {
            scale: galleryScale,
            y: 0,
            x: 0,
            rotation: 0,
            duration: 2.5,
            ease: "power4.inOut",
            onComplete: () => {
                isPreviewActive = isTransitioning = false;
                Object.assign(parallaxState, {
                    targetX: 0,
                    targetY: 0,
                    targetZ: 0,
                    currentY: 0,
                    currentX: 0,
                    currentZ: 0,
                });
            },
        });
    }

    function handleResize() {
        const viewportWidth = window.innerWidth;
        config.isMoblie = viewportWidth < 1000;

        let galleryScale = 1;
        if (viewportWidth < 768) {
            galleryScale = 0.6;
        } else if (viewportWidth < 1200) {
            galleryScale = 0.8;
        }

        config.galleryScale = galleryScale;
        gsap.set(gallery, {
            scale: galleryScale,
        });

        if (!isPreviewActive) {
            parallaxState.targetX = 0;
            parallaxState.targetY = 0;
            parallaxState.targetZ = 0;
            parallaxState.currentX = 0;
            parallaxState.currentY = 0;
            parallaxState.currentZ = 0;

            transformState.forEach((state) => {
                state.targetRotation = 0;
                state.currentRotation = 0;
                state.targetScale = 1;
                state.currentScale = 1;
                state.targetX = 0;
                state.currentX = 0;
                state.targetY = 0;
                state.currentY = 0;

                // Update base positions on resize
                state.baseX = config.radius * state.cosAngle;
                state.baseY = config.radius * state.sinAngle;
            });
        }
    }

    window.addEventListener("resize", handleResize);
    handleResize();

    let lastTouchX = 0;
    let isTouching = false;

    const mobileHint = document.querySelector(".mobile-hint");

    document.addEventListener("touchstart", (e) => {
        if (!config.isMoblie || isPreviewActive || isTransitioning) return;
        isTouching = true;
        lastTouchX = e.touches[0].clientX;
        
        if (mobileHint) gsap.to(mobileHint, { opacity: 0, duration: 0.5 });
    }, { passive: true });

    document.addEventListener("touchmove", (e) => {
        if (!isTouching || !config.isMoblie || isPreviewActive || isTransitioning) return;
        
        const touchX = e.touches[0].clientX;
        const deltaX = touchX - lastTouchX;
        lastTouchX = touchX;

        // Rotate the gallery based on horizontal swipe
        parallaxState.targetZ += deltaX * 0.2;
    }, { passive: true });

    document.addEventListener("touchend", () => {
        isTouching = false;
    });

    document.addEventListener("click", () => {
        if (isPreviewActive && !isTransitioning) resetGallery();
    });

    document.addEventListener("mousemove", (e) => {
        if (isPreviewActive || isTransitioning || config.isMoblie) return;

        // Throttle updates to ~60fps to reduce CPU strain during mouse movement
        const now = performance.now();
        if (now - lastMouseMoveTime < 16) return;
        lastMouseMoveTime = now;

        const centerX = window.innerWidth / 2;
        const centerY = window.innerHeight / 2;
        const percentX = (e.clientX - centerX) / centerX;
        const percentY = (e.clientY - centerY) / centerY;

        parallaxState.targetY = percentX * 15;
        parallaxState.targetX = -percentY * 15;
        parallaxState.targetZ = (percentX + percentY) * 5;

        const radiusScaled = config.radius * config.galleryScale;
        const sensitivitySq = config.sensitivitySq;

        for (let i = 0; i < cards.length; i++) {
            const state = transformState[i];

            // Fast distance check using squared distance (skips Math.sqrt if out of range)
            const cardX = centerX + radiusScaled * state.cosAngle;
            const cardY = centerY + radiusScaled * state.sinAngle;

            const dx = e.clientX - cardX;
            const dy = e.clientY - cardY;
            const distSq = dx * dx + dy * dy;

            if (distSq < sensitivitySq) {
                const distance = Math.sqrt(distSq);
                const flipFactor = Math.max(0, 1 - distance / config.effectFalloff);
                const moveAmount = config.cardMoveAmount * flipFactor;

                state.targetRotation = 180 * flipFactor;
                state.targetScale = 1 + 0.3 * flipFactor;
                state.targetX = moveAmount * state.cosAngle;
                state.targetY = moveAmount * state.sinAngle;
                state.isAnimating = true;
            } else if (state.targetRotation !== 0 || state.targetScale !== 1) {
                state.targetRotation = 0;
                state.targetScale = 1;
                state.targetX = 0;
                state.targetY = 0;
                state.isAnimating = true;
            }
        }
    });

    // Pre-create quickSetters for better performance
    const gallerySetter = {
        rotateX: gsap.quickSetter(galleryContainer, "rotateX", "deg"),
        rotateY: gsap.quickSetter(galleryContainer, "rotateY", "deg"),
        rotation: gsap.quickSetter(galleryContainer, "rotation", "deg"),
    };

    const cardSetters = cards.map(card => ({
        x: gsap.quickSetter(card, "x", "px"),
        y: gsap.quickSetter(card, "y", "px"),
        rotationY: gsap.quickSetter(card, "rotationY", "deg"),
        scale: gsap.quickSetter(card, "scale"),
        rotation: gsap.quickSetter(card, "rotation", "deg"),
    }));

    function animate() {
        if (!isPreviewActive && !isTransitioning) {
            // Continuous rotation on mobile when not interacting
            if (config.isMoblie && !isTouching) {
                parallaxState.targetZ += 0.25; // Smooth slow rotation
            }

            const distX = parallaxState.targetX - parallaxState.currentX;
            const distY = parallaxState.targetY - parallaxState.currentY;
            const distZ = parallaxState.targetZ - parallaxState.currentZ;

            // Only update gallery if it's actually moving
            if (Math.abs(distX) > 0.001 || Math.abs(distY) > 0.001 || Math.abs(distZ) > 0.001) {
                parallaxState.currentX += distX * config.lerpFactor;
                parallaxState.currentY += distY * config.lerpFactor;
                parallaxState.currentZ += distZ * config.lerpFactor;

                gallerySetter.rotateX(parallaxState.currentX);
                gallerySetter.rotateY(parallaxState.currentY);
                gallerySetter.rotation(parallaxState.currentZ);
            }

            for (let i = 0; i < cards.length; i++) {
                const state = transformState[i];
                if (!state.isAnimating) continue;

                const dRot = state.targetRotation - state.currentRotation;
                const dScale = state.targetScale - state.currentScale;
                const dX = state.targetX - state.currentX;
                const dY = state.targetY - state.currentY;

                // Check if card has reached its target
                if (Math.abs(dRot) < 0.01 && Math.abs(dScale) < 0.001 && Math.abs(dX) < 0.01 && Math.abs(dY) < 0.01) {
                    state.currentRotation = state.targetRotation;
                    state.currentScale = state.targetScale;
                    state.currentX = state.targetX;
                    state.currentY = state.targetY;
                    state.isAnimating = false; // Stop processing this card next frame
                } else {
                    state.currentRotation += dRot * config.lerpFactor;
                    state.currentScale += dScale * config.lerpFactor;
                    state.currentX += dX * config.lerpFactor;
                    state.currentY += dY * config.lerpFactor;
                }

                const setter = cardSetters[i];
                setter.x(state.baseX + state.currentX);
                setter.y(state.baseY + state.currentY);
                setter.rotationY(state.currentRotation);
                setter.scale(state.currentScale);
                // rotation is static, no need to update every frame
            }
        }
        requestAnimationFrame(animate);
    }

    animate();
});
