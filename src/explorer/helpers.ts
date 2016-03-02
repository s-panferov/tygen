export function waitForEl(id: string, cb: (el: HTMLElement) => any, attempts = 0) {
    function worker() {
        let el = document.getElementById(id);
        if (el) {
            cb(el);
        } else {
            if (attempts > 50) {
                throw new Error('Cant wait for id more than 500ms ' + id);
            } else {
                setTimeout(worker, 100 + attempts * 10);
            }
        }
    }
    setTimeout(worker, 100);
}

export function requireScript(src: string): Promise<Event> {
    let s = document.createElement('script');
    s.type = 'text/javascript';
    s.async = true;
    s.src = src;

    return new Promise((resolve, reject) => {
        s.addEventListener('load', function (e: Event) { resolve(e); }, false);
        let head = document.getElementsByTagName('head')[0];
        head.appendChild(s);
    });
}
