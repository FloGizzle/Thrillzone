<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Customizable Spinning Wheel</title>
    <style>
        html, body {
            margin: 0;
            padding: 0;
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            min-height: 100vh;
        }

        .container {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            gap: 1rem;
            margin-top: 100px;
        }

        .wheel-container {
            position: relative;
            width: 150px;
            height: 150px;
        }

        .wheel {
            width: 100%;
            height: 100%;
        }

        .pointer {
            position: absolute;
            top: -5px;
            left: 50%;
            transform: translateX(-50%);
            width: 0;
            height: 0;
            border-left: 8px solid transparent;
            border-right: 8px solid transparent;
            border-top: 12px solid red;
            z-index: 2;
        }

        .result {
            font-size: 0.875rem;
            font-weight: bold;
            text-align: center;
            margin-top: 1rem;
        }

        .input-area {
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            text-align: center;
        }

        textarea {
            width: 200px;
            height: 100px;
            margin-bottom: 10px;
            padding: 5px;
        }

        button {
            padding: 8px 16px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div class="input-area">
        <textarea id="namesInput" placeholder="Enter names, one per line">Alice
Bob
Charlie
David</textarea>
        <br>
        <button onclick="updateWheel()">Update Wheel</button>
    </div>
    <div class="container">
        <div class="wheel-container">
            <svg class="wheel" viewBox="0 0 100 100">
                <!-- Segments will be added here -->
            </svg>
            <div class="pointer"></div>
        </div>
        <div id="result" class="result"></div>
    </div>

    <script>
        class SpinningWheel {
            constructor(names) {
                this.names = names;
                this.spinning = false;
                this.rotation = 0;
                this.wheel = document.querySelector('.wheel');
                this.resultDiv = document.getElementById('result');
                this.createWheel();
            }

            getSegmentPath(index) {
                const segmentAngle = 360 / this.names.length;
                const startAngle = index * segmentAngle;
                const endAngle = (index + 1) * segmentAngle;

                const start = {
                    x: 50 + 50 * Math.cos((startAngle * Math.PI) / 180),
                    y: 50 + 50 * Math.sin((startAngle * Math.PI) / 180)
                };

                const end = {
                    x: 50 + 50 * Math.cos((endAngle * Math.PI) / 180),
                    y: 50 + 50 * Math.sin((endAngle * Math.PI) / 180)
                };

                const largeArcFlag = segmentAngle <= 180 ? 0 : 1;

                return `M 50 50 L ${start.x} ${start.y} A 50 50 0 ${largeArcFlag} 1 ${end.x} ${end.y} Z`;
            }

            createWheel() {
                // Clear existing segments
                this.wheel.innerHTML = '';
                
                this.names.forEach((name, index) => {
                    const angle = (360 / this.names.length) * index;
                    const segmentPath = this.getSegmentPath(index);
                    const textAngle = angle + (360 / this.names.length / 2);
                    const textRadius = 35;
                    const textX = 50 + textRadius * Math.cos((textAngle * Math.PI) / 180);
                    const textY = 50 + textRadius * Math.sin((textAngle * Math.PI) / 180);

                    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
                    
                    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                    path.setAttribute("d", segmentPath);
                    path.setAttribute("fill", `hsl(${(360 / this.names.length) * index}, 70%, 70%)`);
                    path.setAttribute("stroke", "black");
                    path.setAttribute("stroke-width", "0.5");

                    const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
                    text.setAttribute("x", textX);
                    text.setAttribute("y", textY);
                    text.setAttribute("fill", "black");
                    text.setAttribute("font-size", "4");
                    text.setAttribute("font-weight", "bold");
                    text.setAttribute("text-anchor", "middle");
                    text.setAttribute("dominant-baseline", "middle");
                    text.setAttribute("transform", `rotate(${angle + (360 / this.names.length / 2)}, ${textX}, ${textY})`);
                    text.textContent = name;

                    g.appendChild(path);
                    g.appendChild(text);
                    this.wheel.appendChild(g);
                });
            }

            spin() {
                return new Promise((resolve) => {
                    if (this.spinning) return;
                    
                    this.spinning = true;
                    this.resultDiv.textContent = '';

                    const currentRotation = this.rotation % 360;
                    const segmentSize = 360 / this.names.length;
                    const selectedIndex = Math.floor(Math.random() * this.names.length);

                    const segmentStart = -(selectedIndex * segmentSize + 90);
                    const randomOffset = Math.random() * segmentSize;
                    const targetRotation = segmentStart - randomOffset;

                    let requiredRotation = targetRotation - currentRotation;
                    if (requiredRotation > 0) {
                        requiredRotation = requiredRotation - 360;
                    }

                    const minimumRotations = 20;
                    const extraRotations = Math.floor(Math.random() * 5);
                    const totalRotations = minimumRotations + extraRotations;
                    const fullSpinsRotation = -totalRotations * 360;

                    const finalRotation = this.rotation + requiredRotation + fullSpinsRotation;
                    this.rotation = finalRotation;

                    this.wheel.style.transform = `rotate(${finalRotation}deg)`;
                    this.wheel.style.transition = 'transform 3s cubic-bezier(0.2, 0.8, 0.2, 1)';

                    setTimeout(() => {
                        this.spinning = false;
                        const selectedName = this.names[selectedIndex];
                        this.resultDiv.textContent = `Selected: ${selectedName}`;
                        resolve(selectedName);
                    }, 3000);
                });
            }
        }

        // Initialize wheel with default names
        let wheel;
        
        function updateWheel() {
            const namesInput = document.getElementById('namesInput').value;
            const names = namesInput.split('\n').filter(name => name.trim() !== '');
            
            if (names.length < 2) {
                alert('Please enter at least 2 names');
                return;
            }
            
            // Create new wheel instance
            wheel = new SpinningWheel(names);
            
            // Reset any existing rotation
            wheel.wheel.style.transition = 'none';
            wheel.wheel.style.transform = 'rotate(0deg)';
            wheel.rotation = 0;
        }

        // Initialize the wheel on page load
        document.addEventListener('DOMContentLoaded', updateWheel);

        // Add click handler for spinning
        document.querySelector('.wheel-container').addEventListener('click', () => {
            if (wheel) wheel.spin();
        });
    </script>
</body>
</html>