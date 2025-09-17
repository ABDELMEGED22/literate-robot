document.addEventListener('DOMContentLoaded', function() {
    // Elements
    const loadingScreen = document.getElementById('loadingScreen');
    const appContainer = document.getElementById('appContainer');
    const countdownBlock = document.getElementById('countdownBlock');
    const countdownEnded = document.getElementById('countdownEnded');

    const daysEl = document.getElementById('days');
    const hoursEl = document.getElementById('hours');
    const minutesEl = document.getElementById('minutes');
    const secondsEl = document.getElementById('seconds');

    // Safe guard: if essential elements missing, stop and log
    if (!appContainer || !loadingScreen) {
        console.warn('Essential DOM elements missing: appContainer or loadingScreen');
        return;
    }

    // Loading screen handling
    window.addEventListener('load', () => {
        loadingScreen.style.opacity = '0';
        setTimeout(() => {
            loadingScreen.style.display = 'none';
            appContainer.style.display = '';
            appContainer.style.opacity = '1';
        }, 400);
    });

    // Tab Navigation (robust)
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    if (navTabs.length && tabContents.length) {
        navTabs.forEach(tab => {
            tab.addEventListener('click', function() {
                navTabs.forEach(t => {
                    t.classList.remove('active');
                    t.setAttribute('aria-selected', 'false');
                });
                tabContents.forEach(content => {
                    content.classList.remove('active');
                    content.style.display = 'none';
                });

                this.classList.add('active');
                this.setAttribute('aria-selected', 'true');
                const targetId = this.dataset.tab;
                const targetTab = document.getElementById(targetId);
                if (targetTab) {
                    targetTab.classList.add('active');
                    targetTab.style.display = '';
                }
            });
        });
    }

    // Countdown Timer
    // Updated target date to a future date (you can change as needed)
    const targetDate = new Date('2026-12-31T23:59:59Z'); // UTC target
    let timerId = null;

    function pad(v) { return String(v).padStart(2, '0'); }

    function updateCountdown() {
        if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !countdownBlock || !countdownEnded) {
            // Missing elements: stop updates
            if (timerId) clearInterval(timerId);
            return;
        }

        const now = new Date();
        const diff = targetDate.getTime() - now.getTime();

        if (diff <= 0) {
            // Ended
            daysEl.textContent = '00';
            hoursEl.textContent = '00';
            minutesEl.textContent = '00';
            secondsEl.textContent = '00';
            countdownBlock.style.display = 'none';
            countdownEnded.style.display = '';
            if (timerId) {
                clearInterval(timerId);
                timerId = null;
            }
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        daysEl.textContent = pad(days);
        hoursEl.textContent = pad(hours);
        minutesEl.textContent = pad(minutes);
        secondsEl.textContent = pad(seconds);
    }

    // Start countdown only if elements exist
    if (daysEl && hoursEl && minutesEl && secondsEl && countdownBlock && countdownEnded) {
        updateCountdown();
        timerId = setInterval(updateCountdown, 1000);
    }

});