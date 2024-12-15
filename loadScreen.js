class LoadScreen {
    constructor(onComplete) {
        this.onComplete = onComplete;
        this.audio = new Audio('assets/waves.mp3');
        this.audio.loop = true;
        this.createLoadScreen();
    }

    createLoadScreen() {
        // Create load screen container
        this.loadScreen = document.createElement('div');
        this.loadScreen.className = 'load-screen';
        
        // Create text container
        this.textContainer = document.createElement('div');
        this.textContainer.className = 'load-screen-text';
        
        this.loadScreen.appendChild(this.textContainer);
        document.body.appendChild(this.loadScreen);

        // Play the audio
        this.audio.play()
            .catch(e => console.log('Audio autoplay was prevented by browser'));
        
        // Start the typewriter effect
        this.typeWriter(
            "You are a 25 year old software engineer at a local startup. You have a passion for technology and a desire to make a difference in the world.",
            () => this.disintegrate()
        );
    }

    typeWriter(text, callback) {
        const speed = 50; // milliseconds per character
        let i = 0;
        
        const type = () => {
            if (i < text.length) {
                this.textContainer.textContent += text.charAt(i);
                i++;
                setTimeout(type, speed);
            } else {
                setTimeout(callback, 1000); // Wait 1 second before disintegration
            }
        };
        
        type();
    }

    disintegrate() {
        // Split text into individual span elements for each character
        const text = this.textContainer.textContent;
        this.textContainer.textContent = '';
        
        [...text].forEach((char, i) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.style.animationDelay = `${Math.random() * 0.5}s`;
            span.className = 'disintegrate';
            this.textContainer.appendChild(span);
        });

        // Fade out audio during disintegration
        const fadeAudio = setInterval(() => {
            if (this.audio.volume > 0.1) {
                this.audio.volume -= 0.1;
            } else {
                clearInterval(fadeAudio);
                this.audio.pause();
                this.audio.remove();
            }
        }, 100);

        // Remove load screen after animation
        setTimeout(() => {
            this.loadScreen.remove();
            if (this.onComplete) this.onComplete();
        }, 2000);
    }
} 