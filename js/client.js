const socket = io('ws://localhost:8443');

socket.on('message', text => {

    const el = document.createElement('li');
    el.innerHTML = text;
    document.querySelector('ul').appendChild(el);
});

document.querySelector('button').onclick = () => {
    const data = {
        username: document.getElementsByClassName('username')[0].value,
        message: document.getElementsByClassName('message')[0].value
    }
    socket.emit('message', data);
    document.getElementsByClassName('message')[0].value = '';
}