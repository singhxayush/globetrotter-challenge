import confetti from "canvas-confetti";

export const smallScreenConfetti = () => {
  const duration = 4000;
  const end = Date.now() + duration;

  const interval = setInterval(() => {
    const timeLeft = end - Date.now();

    if (timeLeft <= 0) {
      clearInterval(interval);
      return;
    }

    confetti({
      particleCount: 50,
      startVelocity: 18,
      spread: 400,
      ticks: 300,
      gravity: 0.7,
      origin: {x: Math.random(), y: 0},
    });
  }, 250);
};

export const bigScreenConfetti = () => {
    const duration = 200; // Adjust duration as needed
    const end = Date.now() + duration;
  
    const shootConfetti = () => {
      // Bottom-left burst, angled towards center
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 1, x: 0 }, // Bottom-left
        angle: 60, // Fire towards top-right
      });
  
      // Bottom-right burst, angled towards center
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 1, x: 1 }, // Bottom-right
        angle: 120, // Fire towards top-left
      });
  
      if (Date.now() < end) {
        requestAnimationFrame(shootConfetti);
      }
    };
  
    shootConfetti();
  };
  