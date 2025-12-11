'use client';


export default function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = 'Remove', cancelText = 'Cancel' }) {
    if (!isOpen) return null;

    return (
        <div className="fixed top-0 left-0 w-full h-full bg-black/50 z-[3000] flex justify-center items-center backdrop-blur-[2px]" onClick={onClose}>
            <div className="bg-white p-8 rounded-lg w-[90%] max-w-[400px] shadow-[0_4px_20px_rgba(0,0,0,0.15)] border border-black/5 animate-popIn" onClick={e => e.stopPropagation()}>
                <h3 className="font-heading text-primary text-2xl mb-4 mt-0">{title}</h3>
                <p className="text-[#666] mb-8 leading-relaxed">{message}</p>
                <div className="flex justify-end gap-4">
                    <button className="bg-transparent border border-[#ddd] px-4 py-2 rounded cursor-pointer font-medium text-[#666] hover:bg-gray-100" onClick={onClose}>{cancelText}</button>
                    <button className="bg-primary text-white border-none px-4 py-2 rounded cursor-pointer font-medium hover:opacity-90" onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
