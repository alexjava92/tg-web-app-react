import {toast} from "react-toastify";
import {useCallback} from "react";
// Хук для работы с уведомлениями
export const useCopyToClipboard = (text) => {
    const handleCopyAddress = useCallback(() => {
        // Показываем уведомление об успешном копировании
        toast.success(text, {
            position: 'top-center',
            autoClose: 300, // Закрытие через 3 секунды
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            style: {
                background: 'var(--tg-theme-bg-color)', // Задайте цвет фона
                color: 'var(--tg-theme-text-color)', // Задайте цвет текста
            },
        });
    }, []);

    return { handleCopyAddress };
};