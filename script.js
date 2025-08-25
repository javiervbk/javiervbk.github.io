// Tetris Portfolio JavaScript
document.addEventListener('DOMContentLoaded', function() {
    // Add staggered animation delays to project blocks
    const projectBlocks = document.querySelectorAll('.project-block');
    projectBlocks.forEach((block, index) => {
        block.style.setProperty('--delay', index);
    });

    // Create falling blocks animation for background
    createFallingBlocks();
    
    // Add interactive effects
    addInteractiveEffects();
    
    // Start the next block rotation
    rotateNextBlock();
    
    // Add keyboard navigation like Tetris
    addKeyboardNavigation();
});

function createFallingBlocks() {
    const container = document.querySelector('.game-board');
    const blockTypes = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
    const colors = [
        '#00ffff', '#ffff00', '#aa00ff', '#00ff00', 
        '#ff0000', '#0000ff', '#ff8800'
    ];

    // Create background falling blocks
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            createFallingBlock(container, blockTypes, colors);
        }, i * 2000);
    }
    
    // Continuous falling blocks
    setInterval(() => {
        createFallingBlock(container, blockTypes, colors);
    }, 8000);
}

function createFallingBlock(container, blockTypes, colors) {
    const block = document.createElement('div');
    const randomType = blockTypes[Math.floor(Math.random() * blockTypes.length)];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    block.className = 'falling-background-block';
    block.style.cssText = `
        position: fixed;
        width: 30px;
        height: 30px;
        background: ${randomColor};
        border: 2px solid ${randomColor};
        border-radius: 3px;
        left: ${Math.random() * window.innerWidth}px;
        top: -50px;
        z-index: -1;
        opacity: 0.3;
        animation: fallDown ${5 + Math.random() * 5}s linear forwards;
    `;
    
    document.body.appendChild(block);
    
    // Remove block after animation
    setTimeout(() => {
        if (block.parentNode) {
            block.parentNode.removeChild(block);
        }
    }, 10000);
}

// Add CSS for falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fallDown {
        to {
            top: ${window.innerHeight + 50}px;
            transform: rotate(360deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

function addInteractiveEffects() {
    // Add hover sound effect (visual feedback)
    const interactiveElements = document.querySelectorAll('.tetris-link, .skill-block, .project-block');
    
    interactiveElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            this.style.transform = this.style.transform + ' scale(1.05)';
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.cssText = `
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.3);
                transform: scale(0);
                animation: rippleEffect 0.6s linear;
                width: 20px;
                height: 20px;
                top: 50%;
                left: 50%;
                margin-left: -10px;
                margin-top: -10px;
                pointer-events: none;
            `;
            
            if (this.style.position !== 'absolute' && this.style.position !== 'relative') {
                this.style.position = 'relative';
            }
            
            this.appendChild(ripple);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
            }, 600);
        });
        
        element.addEventListener('mouseleave', function() {
            this.style.transform = this.style.transform.replace(' scale(1.05)', '');
        });
    });
}

// Add ripple effect CSS
const rippleStyle = document.createElement('style');
rippleStyle.textContent = `
    @keyframes rippleEffect {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyle);

function rotateNextBlock() {
    const nextBlock = document.querySelector('.next-block');
    const blockTypes = [
        { shape: '▣', color: '#00ffff' },  // I
        { shape: '◼', color: '#ffff00' },  // O
        { shape: '⟙', color: '#aa00ff' },  // T
        { shape: '◢', color: '#00ff00' },  // S
        { shape: '◣', color: '#ff0000' },  // Z
        { shape: '⌐', color: '#0000ff' },  // J
        { shape: '⌐', color: '#ff8800' }   // L
    ];
    
    let currentIndex = 0;
    
    setInterval(() => {
        const currentBlock = blockTypes[currentIndex];
        const miniBlock = nextBlock.querySelector('.mini-block');
        
        miniBlock.textContent = currentBlock.shape;
        miniBlock.style.background = currentBlock.color;
        miniBlock.style.border = `2px solid ${currentBlock.color}`;
        miniBlock.style.display = 'flex';
        miniBlock.style.alignItems = 'center';
        miniBlock.style.justifyContent = 'center';
        miniBlock.style.fontSize = '2rem';
        miniBlock.style.color = '#fff';
        
        currentIndex = (currentIndex + 1) % blockTypes.length;
    }, 2000);
}

function addKeyboardNavigation() {
    let currentSection = 0;
    const sections = document.querySelectorAll('.tetris-section');
    
    // Highlight first section
    if (sections.length > 0) {
        sections[0].style.outline = '3px solid #00ffff';
        sections[0].style.outlineOffset = '5px';
    }
    
    document.addEventListener('keydown', function(e) {
        // Arrow keys navigation like Tetris
        switch(e.key) {
            case 'ArrowDown':
                e.preventDefault();
                if (currentSection < sections.length - 1) {
                    sections[currentSection].style.outline = 'none';
                    currentSection++;
                    sections[currentSection].style.outline = '3px solid #00ffff';
                    sections[currentSection].style.outlineOffset = '5px';
                    sections[currentSection].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
                
            case 'ArrowUp':
                e.preventDefault();
                if (currentSection > 0) {
                    sections[currentSection].style.outline = 'none';
                    currentSection--;
                    sections[currentSection].style.outline = '3px solid #00ffff';
                    sections[currentSection].style.outlineOffset = '5px';
                    sections[currentSection].scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
                break;
                
            case 'Enter':
                e.preventDefault();
                // Animate current section
                const currentSectionElement = sections[currentSection];
                currentSectionElement.style.animation = 'none';
                setTimeout(() => {
                    currentSectionElement.style.animation = 'blockFall 0.5s ease-out';
                }, 10);
                
                // If it's a project block, try to click the link
                const link = currentSectionElement.querySelector('.tetris-link');
                if (link) {
                    link.click();
                }
                break;
                
            case ' ': // Spacebar - rotate effect
                e.preventDefault();
                const section = sections[currentSection];
                section.style.transform = 'rotateY(180deg)';
                setTimeout(() => {
                    section.style.transform = 'rotateY(0deg)';
                }, 500);
                break;
        }
    });
}

// Add some Easter eggs
document.addEventListener('keydown', function(e) {
    // Konami code-like sequence for special effect
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight'];
    if (!window.konamiProgress) window.konamiProgress = 0;
    
    if (e.key === konamiCode[window.konamiProgress]) {
        window.konamiProgress++;
        if (window.konamiProgress === konamiCode.length) {
            // Easter egg: Change all blocks to rainbow colors
            activateRainbowMode();
            window.konamiProgress = 0;
        }
    } else {
        window.konamiProgress = 0;
    }
});

function activateRainbowMode() {
    const allBlocks = document.querySelectorAll('.tetris-section, .project-block');
    const rainbowColors = [
        'linear-gradient(135deg, #ff0000, #ff8800)',
        'linear-gradient(135deg, #ff8800, #ffff00)',
        'linear-gradient(135deg, #ffff00, #00ff00)',
        'linear-gradient(135deg, #00ff00, #00ffff)',
        'linear-gradient(135deg, #00ffff, #0000ff)',
        'linear-gradient(135deg, #0000ff, #aa00ff)',
        'linear-gradient(135deg, #aa00ff, #ff00ff)'
    ];
    
    allBlocks.forEach((block, index) => {
        const colorIndex = index % rainbowColors.length;
        block.style.background = rainbowColors[colorIndex];
        block.style.animation = 'rainbowPulse 1s infinite';
    });
    
    // Add rainbow pulse animation
    if (!document.getElementById('rainbow-style')) {
        const rainbowStyle = document.createElement('style');
        rainbowStyle.id = 'rainbow-style';
        rainbowStyle.textContent = `
            @keyframes rainbowPulse {
                0%, 100% { transform: scale(1) rotate(0deg); }
                50% { transform: scale(1.1) rotate(5deg); }
            }
        `;
        document.head.appendChild(rainbowStyle);
    }
    
    // Show message
    const message = document.createElement('div');
    message.textContent = '🌈 RAINBOW MODE ACTIVATED! 🌈';
    message.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(45deg, #ff0000, #ff8800, #ffff00, #00ff00, #00ffff, #0000ff, #aa00ff);
        color: white;
        padding: 20px;
        border-radius: 10px;
        font-size: 1.5rem;
        font-weight: bold;
        z-index: 1000;
        animation: rainbowPulse 1s infinite;
        box-shadow: 0 0 30px rgba(255, 255, 255, 0.5);
    `;
    
    document.body.appendChild(message);
    
    setTimeout(() => {
        document.body.removeChild(message);
    }, 3000);
    
    // Reset after 10 seconds
    setTimeout(() => {
        location.reload();
    }, 10000);
}

// Add performance monitoring
window.addEventListener('load', function() {
    console.log('🎮 Tetris Portfolio loaded!');
    console.log('💡 Try using arrow keys to navigate!');
    console.log('🌈 Can you find the secret rainbow mode?');
});