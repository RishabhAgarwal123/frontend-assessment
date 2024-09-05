import { useEffect, useState } from "react";
import { useUsers } from "../context/UserContext";
import Loader from "../shared/Loader";

interface PropType {
    close: () => void,
    isOpen: boolean,
    user: {
        name: string,
        email: string,
        id?: string
    }
}

const DeleteModal = ({ close, isOpen, user }: PropType) => {
    const { deleteUser, loading } = useUsers();
    const [modalState, setModalState] = useState<boolean>(false);

    const handleDelete = () => {
        if (user && user.id) deleteUser(user.id);
        close();
    };

    useEffect(() => {
        if (isOpen) setModalState(true);
        else {
            const timer = setTimeout(() => setModalState(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, close]);

    if (loading) return <Loader />

    return <div
        className={`modal-overlay ${modalState ? 'show' : ''}`}
        onClick={close}
        aria-hidden={!isOpen}
        role="dialog"
        aria-labelledby="modal-title"
    >
        <div
            className={`modal-content ${modalState ? 'show' : ''}`}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
        >
            <div className="flex justify-between align-center border-bottom">
                <h2 id="modal-title" className="para-1 text-left">Delete</h2>
                <button className="close" onClick={close} aria-label="Close Modal">
                    X
                </button>
            </div>
            <p className="text-left">
                {`Are you sure you want to delete user `}
                <strong>{user.name}</strong>
                {` with email `}
                <strong>{user.email}</strong>
                {`?`}
            </p>

            <div className="border-top">
                <div className="btns-group flex justify-end gap-2">
                    <button className="btn modal-btn" onClick={close}>
                        Cancel
                    </button>
                    <button className="btn modal-btn delete-btn" onClick={handleDelete}>Delete</button>
                </div>
            </div>
        </div>
    </div>
}

export default DeleteModal;