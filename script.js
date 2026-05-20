// --- WEDDING WEBSITE SCRIPT ---

// 1. CONFIGURATION
// Easily change your wedding date here (Format: YYYY-MM-DDTHH:MM:SS)
const WEDDING_DATE = new Date("2026-05-08T15:00:00").getTime();

document.addEventListener("DOMContentLoaded", () => {
    // 2. LIVE COUNTDOWN TIMER
    const countdown = {
        days: document.getElementById("days"),
        hours: document.getElementById("hours"),
        minutes: document.getElementById("minutes"),
        seconds: document.getElementById("seconds")
    };

    if (countdown.days) {
        const updateCountdown = () => {
            const now = new Date().getTime();
            const difference = WEDDING_DATE - now;

            if (difference < 0) {
                // The wedding has started or passed!
                const container = document.querySelector(".countdown-container");
                if (container) {
                    container.innerHTML = `<div style="font-family: var(--font-display); font-size: 1.8rem; color: var(--color-primary);">Happily Married! 🤍</div>`;
                }
                clearInterval(timerInterval);
                return;
            }

            // Time calculations
            const daysVal = Math.floor(difference / (1000 * 60 * 60 * 24));
            const hoursVal = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutesVal = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
            const secondsVal = Math.floor((difference % (1000 * 60)) / 1000);

            // Display results with leading zeros
            countdown.days.innerText = String(daysVal).padStart(2, '0');
            countdown.hours.innerText = String(hoursVal).padStart(2, '0');
            countdown.minutes.innerText = String(minutesVal).padStart(2, '0');
            countdown.seconds.innerText = String(secondsVal).padStart(2, '0');
        };

        // Run immediately, then every second
        updateCountdown();
        const timerInterval = setInterval(updateCountdown, 1000);
    }

    // 3. DYNAMIC QR CODE GENERATOR & DOWNLOAD
    const qrElement = document.getElementById("qrcode");
    const downloadBtn = document.getElementById("download-qr-btn");

    if (qrElement) {
        // Use the page's current URL (handles local dev and GitHub Pages URL dynamically!)
        const currentUrl = window.location.href;

        // Generate QR code using the imported library
        // We customize the dark color to match our Boho Sage Green!
        const qrCodeInstance = new QRCode(qrElement, {
            text: currentUrl,
            width: 200,
            height: 200,
            colorDark: "#5F6F52", // Sage Green
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H
        });

        // Set up the download button to grab the generated QR image
        if (downloadBtn) {
            downloadBtn.addEventListener("click", (e) => {
                e.preventDefault();
                
                // The QRCode library creates a canvas element and/or an img element.
                // We prioritize downloading from the canvas for maximum resolution and reliability.
                const canvas = qrElement.querySelector("canvas");
                const img = qrElement.querySelector("img");

                let dataUrl = "";
                if (canvas) {
                    dataUrl = canvas.toDataURL("image/png");
                } else if (img && img.src) {
                    dataUrl = img.src;
                }

                if (dataUrl) {
                    const link = document.createElement("a");
                    link.href = dataUrl;
                    link.download = "wedding-qr-code.png";
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                } else {
                    alert("Could not generate download file yet. Please try again in a moment.");
                }
            });
        }
    }

    // 4. SCROLL REVEAL ANIMATIONS
    const revealElements = document.querySelectorAll(".boho-card, .map-card, .qr-card, .organic-divider");
    
    // Set initial styles for animation
    revealElements.forEach(el => {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)";
    });

    const revealOnScroll = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = "1";
                entry.target.style.transform = "translateY(0)";
                observer.unobserve(entry.target); // Trigger once
            }
        });
    }, {
        threshold: 0.15
    });

    revealElements.forEach(el => {
        revealOnScroll.observe(el);
    });
});
