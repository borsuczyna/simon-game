import {useState} from 'react';
import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Simon.module.css'
import SimonElement from '../components/SimonElement'
import SimonBoard from '../components/SimonBoard'

var setElementActive = null;
var isElementActive = null;
var setElementActiveForTime = null;
var setStreak = null;
var streak = 0;

const game = {
    playing: false,
    waitingForUser: false,
    sequence: [],
    userSequence: [],
    waiting: false,
}

export default function Home() {
    let [elementsActive, setElementsActive] = useState([false, false, false, false]);
    [streak, setStreak] = useState(0);

    setElementActive = (index, active) => {
        let newElementsActive = [...elementsActive];
        newElementsActive[index] = active;
        setElementsActive(newElementsActive);

        if(active) {
            var audio = new Audio(`sounds/${index}.mp3`);
            audio.volume = 0.3;
            audio.play();
        }
    };

    setElementActiveForTime = (index, time) => {
        if(game.waiting) return;

        setElementActive(index, true);
        game.waiting = true;

        setTimeout((index) => {
            setElementActive(index, false);
            game.waiting = false;

            if(game.waitingForUser) {
                game.userSequence.push(index);
                
                let match = true;
                for(var i = 0; i < game.userSequence.length; i++) {
                    if(game.userSequence[i] !== game.sequence[i]) {
                        match = false;
                        break;
                    }
                }
                if(!match) {
                    var audio = new Audio('sounds/fail.mp3');
                    audio.volume = 0.3;
                    audio.play();
                    game.userSequence = [];
                    game.waitingForUser = false;
                    game.sequence = [];
                    game.playing = false;
                } else if(game.userSequence.length === game.sequence.length) {
                    setTimeout(() => {
                        game.userSequence = [];
                        game.waitingForUser = false;
                        playSequence();
                    }, 500);
                }
            }
        }, time, index);
    };

    isElementActive = (index) => {
        return elementsActive[index];
    };

    return (
        <div className={styles.container}>
            <Head>
                <title>Simon Game</title>
            </Head>

            <div className={styles.main}>
                <div className={styles.element} style={{
                    position: 'absolute',
                    top: '10%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                }}>Streak: {streak}</div>
                <SimonBoard>
                    <SimonElement color='rgb(0, 255, 40)' active={elementsActive[0]} onClick={() => {
                        if(!game.playing || !game.waitingForUser) return;
                        setElementActiveForTime(0, 300);
                    }} />
                    <SimonElement color='rgb(255, 46, 50)' active={elementsActive[1]} onClick={() => {
                        if(!game.playing || !game.waitingForUser) return;
                        setElementActiveForTime(1, 300);
                    }} />
                    <SimonElement color='rgb(255, 255, 40)' active={elementsActive[2]} onClick={() => {
                        if(!game.playing || !game.waitingForUser) return;
                        setElementActiveForTime(2, 300);
                    }} />
                    <SimonElement color='rgb(52, 100, 255)' active={elementsActive[3]} onClick={() => {
                        if(!game.playing || !game.waitingForUser) return;
                        setElementActiveForTime(3, 300);
                    }} />
                </SimonBoard>
                <button className={styles.element} style={{
                    position: 'absolute',
                    top: '90%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    cursor: 'pointer',
                }} onClick={() => {
                    startGame();
                }}>Start</button>
            </div>
        </div>
    )
}

function addToSequence() {
    game.sequence.push(Math.floor(Math.random() * 4));
}

function playSequence() {
    addToSequence();
    setStreak(game.sequence.length);
    for(var i = 0; i < game.sequence.length; i++) {
        setTimeout(setElementActiveForTime, i * 500, game.sequence[i], 300);
    }
    
    setTimeout(() => {
        game.waitingForUser = true;
        game.userSequence = [];
    }, game.sequence.length * 500 + 200);
}

function startGame() {
    if(game.playing) return;

    game.sequence = [];
    game.playing = true;

    setStreak(0);

    playSequence();
}