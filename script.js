// constant
const NUM_OF_CAT_IMG = 10;

// use CATAAS
let catUrlList = [];

// for summary
let likedCatsList = [];
let currIdx = 0;

// for swiping effect
let isSwiping = false;
let currImg = null;
let swipeX = 0;

// DOM elements
const cardContainer = document.getElementById('card-container');
const summary = document.getElementById('summary');
const catCounter = document.getElementById('cat-counter');
const restartBtn = document.getElementById('restart-btn');
const currCount = document.getElementById('current');
const totalCount = document.getElementById('total');

// for overlay
const startBtn = document.getElementById("start-btn");
const overlay = document.getElementById("overlay");
const container = document.getElementById("container");

// remove overlay
startBtn.addEventListener("click", () => {
    overlay.style.display = "none";
    container.classList.remove("blur");
});

// initializing cat images
function init() 
{
    catUrlList = [] // reset array
    // using for loop
    for (let i = 0; i < NUM_OF_CAT_IMG; i++) 
    {
        const url = `https://cataas.com/cat?${Math.random()}`;
        catUrlList.push(url);
    }
    
    totalCount.textContent = NUM_OF_CAT_IMG;
    showNextImg(); // load next image
}

// create a cat card
function createCard(url) 
{
    const card = document.createElement('div');
    card.className = 'card';

    const img = document.createElement('img');
    img.src = url;
    img.alt = 'Cat';
    card.appendChild(img);

    // overlay
    const loveOverlay = document.createElement('div');
    loveOverlay.className = 'love-overlay';
    loveOverlay.textContent = 'LOVEEE 😍';
    card.appendChild(loveOverlay);

    const rejectedOverlay = document.createElement('div');
    rejectedOverlay.className = 'rejected-overlay';
    rejectedOverlay.textContent = 'REJECTED ❌';
    card.appendChild(rejectedOverlay);

    // Add drag event listeners
    card.addEventListener('mousedown', handleDragStart);
    card.addEventListener('touchstart', handleDragStart);

    return card;
}

// continue to load the next card
function showNextImg() 
{
    if (currIdx >= catUrlList.length) 
    {
        finalSummary();
        return;
    }

    currCount.textContent = currIdx + 1;
    
    const card = createCard(catUrlList[currIdx]); // passing url string
    cardContainer.appendChild(card);
    currImg = card;
}

// Handle drag start
function handleDragStart(e) {
    e.preventDefault();
    isSwiping = true;
    const touch = e.type === 'touchstart' ? e.touches[0] : e;
    swipeX = touch.clientX;

    document.addEventListener('mousemove', handleDragMove);
    document.addEventListener('touchmove', handleDragMove);
    document.addEventListener('mouseup', handleDragEnd);
    document.addEventListener('touchend', handleDragEnd);
}

// Handle drag move
function handleDragMove(e) {
    if (!isSwiping) 
        return;
    
    const touch = e.type === 'touchmove' ? e.touches[0] : e;
    const deltaX = touch.clientX - swipeX;
    const rotation = deltaX * 0.1;

    currImg.style.transform = `translate(${deltaX}px, 0) rotate(${rotation}deg)`;

    // Show overlay based on swipe direction
    const likeOverlay = currImg.querySelector('.love-overlay');
    const dislikeOverlay = currImg.querySelector('.rejected-overlay');

    if (deltaX > 50) {
        // Swiping right - show LIKE
        likeOverlay.style.opacity = Math.min(deltaX / 150, 1);
        dislikeOverlay.style.opacity = 0;

    } else if (deltaX < -50) {
        // Swiping left - show NOPE
        dislikeOverlay.style.opacity = Math.min(Math.abs(deltaX) / 150, 1);
        likeOverlay.style.opacity = 0;
    } else {
        // Not swiping far enough
        likeOverlay.style.opacity = 0;
        dislikeOverlay.style.opacity = 0;
    }
}

// Handle drag end
function handleDragEnd(e) {
    if (!isSwiping) 
        return;
    isSwiping = false;

    const touch = e.type === 'touchend' ? e.changedTouches[0] : e;
    const deltaX = touch.clientX - swipeX;

    // Remove event listeners
    document.removeEventListener('mousemove', handleDragMove);
    document.removeEventListener('touchmove', handleDragMove);
    document.removeEventListener('mouseup', handleDragEnd);
    document.removeEventListener('touchend', handleDragEnd);

    // Check if able to swipe
    if (Math.abs(deltaX) > 100) 
    {
        if (deltaX > 0) 
        {
            swipeCard('like');
        } 
        else 
        {
            swipeCard('dislike');
        }
    }
    else 
    {
        // Reset overlays
        currImg.querySelector('.love-overlay').style.opacity = 0;
        currImg.querySelector('.rejected-overlay').style.opacity = 0;
        currImg.style.transform = ''; // reset back to original position
    }
}

// Swipe card animation
function swipeCard(direction) {
    const card = currImg;
    const moveX = direction === 'like' ? 1000 : -1000;
    
    // Show the appropriate overlay at full opacity
    if (direction === 'like') {
        card.querySelector('.love-overlay').style.opacity = 1;
    } else {
        card.querySelector('.rejected-overlay').style.opacity = 1;
    }
    
    card.style.transition = 'transform 0.5s ease, opacity 0.5s ease';
    card.style.transform = `translateX(${moveX}px) rotate(${moveX * 0.1}deg)`;
    card.style.opacity = '0';

    if (direction === 'like') 
    {
        likedCatsList.push(catUrlList[currIdx]);
        // Create heart animation
        createHeartEffect();
    }
    else
    {
        createXEffect();
    }

    setTimeout(() => {
        card.remove();
        currIdx++;
        showNextImg();
    }, 500);
}

// Create floating hearts effect when liking
function createHeartEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const heart = document.createElement('div');
            heart.className = 'floating-heart';
            heart.textContent = '❤️';
            heart.style.left = `${Math.random() * 80 + 10}%`;
            heart.style.animationDelay = `${Math.random() * 0.3}s`;
            cardContainer.appendChild(heart);

            // Remove heart after animation
            setTimeout(() => heart.remove(), 2000);
        }, i * 100);
    }
}

// Create floating x effect when rejecting
function createXEffect() {
    for (let i = 0; i < 5; i++) {
        setTimeout(() => {
            const x = document.createElement('div');
            x.className = 'floating-x';
            x.textContent = '❌';
            x.style.left = `${Math.random() * 80 + 10}%`;
            x.style.animationDelay = `${Math.random() * 0.3}s`;
            cardContainer.appendChild(x);

            // Remove heart after animation
            setTimeout(() => x.remove(), 2000);
        }, i * 100);
    }
}

// final summary
function finalSummary() {
    cardContainer.style.display = 'none'; // hide emlement
    catCounter.style.display = 'none';
    summary.classList.remove('hidden'); // not hidden anymore

    document.getElementById('total-likes').textContent = likedCatsList.length;
    
    const overallFavs = document.getElementById('final-cat-images');
    overallFavs.innerHTML = '';
    
    if (likedCatsList.length === 0) 
    {
        overallFavs.innerHTML = '<p>Kitties are sad 😿</p>';
    } 
    else {
        likedCatsList.forEach(url => {
            const likedImg = document.createElement('img');
            likedImg.src = url;
            likedImg.className = 'liked-cat-img';
            likedImg.alt = 'Liked cat';
            overallFavs.appendChild(likedImg);
        });
    }
}

function restart() {
    currIdx = 0;
    likedCatsList = [];
    cardContainer.innerHTML = '';
    cardContainer.style.display = 'block'; // visible again 
    catCounter.style.display = 'block'; // visible again
    summary.classList.add('hidden');
    init();
}

// restart the program
restartBtn.addEventListener('click', restart);
init();