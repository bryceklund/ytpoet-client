import React, { useEffect } from 'react';

const Loading = (props) => {
    useEffect(() => {
        function showLetters() {
            const word = ' GENERATING '
            const element = document.getElementById('loading')
            for (let i = 0; i < word.length + 1; i++) {
                if (!props.loading) {
                    break
                }
                setTimeout(function() { 
                    if (!element) {
                        return
                    }
                    if (element.textContent !== word) {
                        element.append(word[i]) 
                    } else {
                        element.innerHTML = ''
                        showLetters()
                    }
                }, i * 100)
            }
        }
        showLetters()
    })
    return (
        <div class='loading' id='loading'>
        </div>
    );
}

export default Loading;
