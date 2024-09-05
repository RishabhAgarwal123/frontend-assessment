import React, { useState, useEffect } from 'react';
import { useUsers } from '../context/UserContext';
import Loader from '../shared/Loader';

interface User {
    id?: string; // Optional for adding new users
    name: string;
    email: string;
}

interface PropType {
    close: () => void;
    isOpen: boolean,
    user?: User;
}

interface FormErrors {
    name?: string;
    email?: string;
}

const UserForm = ({ close, user, isOpen }: PropType) => {
    const [modalState, setModalState] = useState<boolean>(false);
    const { addUser, updateUser, loading } = useUsers();
    const [formData, setFormData] = useState<User>({ name: '', email: '' });
    const [errors, setErrors] = useState<FormErrors>({});
    const [isValid, setIsValid] = useState<boolean>(false);
    const [hasTouched, setHasTouched] = useState<boolean>(false);

    const validateField = (name: string, value: string): string | undefined => {
        switch (name) {
            case 'name':
                return value ? undefined : 'Name is required';
            case 'email':
                if (!value) return 'Email is required';
                return /\S+@\S+\.\S+/.test(value) ? undefined : 'Email is invalid';
            default:
                return undefined;
        }
    };

    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};
        let valid = true;

        for (const [name, value] of Object.entries(formData)) {
            const error = validateField(name, value);
            if (error) {
                newErrors[name as keyof FormErrors] = error;
                valid = false;
            }
        }

        setErrors(newErrors);
        return valid;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        if (!hasTouched) setHasTouched(true);

        const error = validateField(name, value);
        setErrors({
            ...errors,
            [name]: error,
        });

        setIsValid(validateForm());
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isValid) {
            if (user) {
                updateUser({ ...user, ...formData }, user.id || '');
            } else {
                addUser(formData);
            }
            close();
        }
    };

    useEffect(() => {
        if (user) {
            setFormData({ name: user.name, email: user.email });
        }
    }, [user]);

    useEffect(() => {
        const valid = validateForm();
        setIsValid(valid);
    }, [formData]);

    useEffect(() => {
        if (isOpen) setModalState(true);
        else {
            const timer = setTimeout(() => setModalState(false), 300);
            return () => clearTimeout(timer);
        }
    }, [isOpen, close]);

    if (loading) return <Loader />;

    return (
        <div
            className={`modal-overlay ${modalState ? 'show' : ''}`}
            aria-hidden={!modalState}
            role="presentation"
        >
            <div
                className={`modal-content ${modalState ? 'show' : ''}`}
                onClick={(e) => e.stopPropagation()}
                role="dialog"
                aria-modal="true"
                aria-labelledby="modal-title"
            >
                <div className="flex justify-between align-center border-bottom">
                    <h2 id="modal-title" className="para-1 text-left">
                        {user ? 'Update User' : 'Add User'}
                    </h2>
                    <button
                        className="close"
                        onClick={close}
                        aria-label="Close Modal"
                    >
                        X
                    </button>
                </div>
                <form onSubmit={handleSubmit} className="form" aria-labelledby="modal-title">
                    <div className="input-field">
                        <input
                            type="text"
                            name="name"
                            id="name"
                            autoComplete="off"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder=" "
                            aria-required="true"
                        />
                        <label htmlFor="name">Name</label>
                        {hasTouched && errors.name && <span className="error-message">{errors.name}</span>}
                    </div>
                    <div className="input-field">
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder=" "
                            aria-required="true"
                        />
                        <label htmlFor="email">Email</label>
                        {hasTouched && errors.email && <span className="error-message">{errors.email}</span>}
                    </div>
                    <div className="border-top">
                        <div className="btns-group flex justify-end gap-2">
                            <button
                                type="button"
                                className="btn modal-btn"
                                onClick={close}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className='btn primary-btn text-center'
                                disabled={!isValid}
                            >
                                {user ? 'Update User' : 'Add User'}
                            </button>
                        </div>
                    </div>
                </form>
            </div>
        </div>

    );
};

export default UserForm;
