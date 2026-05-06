const VAPID_PUBLIC_KEY = 'BGbQ4efmWd6PPSSzf6eUK3jXonoPdc3vbKkCXEv4eup9NrU8VlaX7X3Z-PO_vHITJbNBbwB_Jly2KGHtXCXhQbA';

function urlBase64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding)
        .replace(/\-/g, '+')
        .replace(/_/g, '/');

    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);

    for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
}

export async function subscribeToNotifications(userId) {
    if ('serviceWorker' in navigator) {
        try {
            const register = await navigator.serviceWorker.register('/sw.js', {
                scope: '/'
            });

            const subscription = await register.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY)
            });

            await fetch('http://localhost:5000/api/auth/subscribe', {
                method: 'POST',
                body: JSON.stringify({ subscription, userId }),
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log('Push notification subscription successful');
        } catch (err) {
            console.error('Push notification subscription failed:', err);
        }
    }
}
