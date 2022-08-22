import { useEffect } from 'react';

function useClickOutside(ref, events, fn) {
    useEffect(() => {
        const onClickOutside = event => {
            if (!ref.current || !ref.current.contains(event.target)) {
                fn(event);
            }
        };

        events.forEach(e => document.addEventListener(e, onClickOutside, true));
        return () => events.forEach(e => document.removeEventListener(e, onClickOutside, true));
    }, [ref, events, fn]);
}

export default useClickOutside;
