import React, { useEffect, useState } from 'react'
import DeleteModal from './DeleteModal';
import UserItem from './UserItem';
import UserForm from './UserForm';
import Loader from '../shared/Loader';
import { useUsers } from '../context/UserContext';
import useDebounce from '../hooks/useDebounce';
import resetUrl from '../assets/reset.svg';
import sortUrl from '../assets/sort.svg';

type ModalTye = 'add' | 'edit' | 'delete' | null;

type User = {
    name: string,
    email: string,
    id?: string
}

type SortConfig = {
    key: keyof User,
    direction: 'asc' | 'dsc'
}

type Search = 'name' | 'email'

const UserList = () => {
    const { loading, users } = useUsers();
    const [searchBy, setSearchBy] = useState<Search>('name');
    const [searchText, setSearchText] = useState<string>('');
    const [modalType, setModalType] = useState<ModalTye>(null);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
    const [sortingConfig, setSortingConfig] = useState<SortConfig>({ key: 'name', direction: 'asc' });
    const debouncedSearchValue = useDebounce(searchText, 500);

    const handleSearchFilter = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const filter = e.target.value;
        setSearchText('');
        setSearchBy(filter as Search);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const search = e.target.value;
        setSearchText(search);
    }

    const filterOutSearchUsers = (text: string, filterBy: Search): User[] => {
        const lowerCasedText = text.toLowerCase();

        return users?.filter((user) => {
            const valueToFilter = (user[filterBy] as string).toLowerCase();
            return valueToFilter.includes(lowerCasedText);
        }) || [];
    }

    const handleSort = (key: keyof User) => {
        const direction = sortingConfig.key === key && sortingConfig.direction === 'asc' ? 'dsc' : 'asc';
        setSortingConfig({ key, direction });

        const sortedUsers = [...filteredUsers].sort((a: User, b: User) => {
            const aValue = a[key];
            const bValue = b[key];

            if (!aValue || !bValue) return 0;

            const aNormalized = typeof aValue === 'string' ? aValue.toLowerCase() : aValue;
            const bNormalized = typeof bValue === 'string' ? bValue.toLowerCase() : bValue;

            if (aNormalized < bNormalized) return direction === 'asc' ? -1 : 1;
            if (aNormalized > bNormalized) return direction === 'asc' ? 1 : -1;

            return 0;
        })

        setFilteredUsers(sortedUsers);
    }

    const resetSearchUsers = () => {
        setFilteredUsers(users ? users : []);
        setSearchBy('name');
        setSearchText('');
    }

    const openModal = (type: ModalTye, user: User | null) => {
        setModalType(type);
        setSelectedUser(user);
    }

    const closeModal = () => {
        setModalType(null);
        setSelectedUser(null);
    }

    useEffect(() => {
        if (users) {
            if (debouncedSearchValue !== '') {
                const filterUsers = filterOutSearchUsers(debouncedSearchValue, searchBy);
                setFilteredUsers(filterUsers);
            } else setFilteredUsers(users);
        }
    }, [debouncedSearchValue, searchBy, users]);

    if (loading) return <Loader />

    return (
        <>
            <div className='main-container'>
                <div className='flex justify-between align-center responsive-header'>
                    <div className='heading'>
                        <h1 className='para-1 text-left'>Users</h1>
                        <div className="search-container">
                            <label htmlFor="search-input" className="sr-only">Search users</label>
                            <input
                                id="search-input"
                                type="text"
                                className="search-input"
                                placeholder="Search..."
                                value={searchText}
                                onChange={(e) => handleChange(e)}
                                aria-label="Search users"
                            />
                            <button
                                className='icon'
                                onClick={resetSearchUsers}
                                aria-label="Reset search"
                            >
                                <img src={resetUrl} alt="Reset Url" />
                            </button>
                            <label htmlFor="search-dropdown" className="sr-only">Search by</label>
                            <select
                                id="search-dropdown"
                                className="search-dropdown"
                                value={searchBy}
                                onChange={(e) => handleSearchFilter(e)}
                                aria-label={`Search by ${searchBy}`}
                            >
                                <option value='name'>Name</option>
                                <option value='email'>Email</option>
                            </select>
                        </div>
                    </div>
                    <button
                        className='btn primary-btn text-center'
                        onClick={() => openModal('add', null)}
                        aria-label="Add new user"
                    >
                        Add User
                    </button>
                </div>
                <div className="container mx-auto">
                    <table className="responsive-table w-full border-collapse border border-gray-300">
                        <thead className="sticky-header">
                            <tr className="bg-gray-100">
                                <th className="border border-gray-300 p-6">
                                    Name
                                    <button
                                        className='icon'
                                        onClick={() => handleSort('name')}
                                        aria-label={`Sort by Name ${sortingConfig.direction}`}
                                    >
                                        <img className='vertical-middle' src={sortUrl} alt='Sorting Url' />
                                    </button>
                                </th>
                                <th className="border border-gray-300 p-6">
                                    Email
                                    <button
                                        className='icon'
                                        onClick={() => handleSort('email')}
                                        aria-label={`Sort by Email ${sortingConfig.direction}`}
                                    >
                                        <img className='vertical-middle' src={sortUrl} alt='Sorting Url' />
                                    </button>
                                </th>
                                <th className="border border-gray-300 p-6">Action</th>
                            </tr>
                        </thead>
                        <tbody className="scrollable-tbody">
                            {
                                filteredUsers && filteredUsers.length > 0 ? filteredUsers?.map((user: any) => {
                                    return (
                                        <UserItem
                                            key={user.id}
                                            {...user}
                                            onEdit={() => openModal('edit', user)}
                                            onDelete={() => openModal('delete', user)}
                                            aria-label={`Edit user ${user.name}`}
                                        />
                                    );
                                }) : (
                                    <tr>
                                        <td colSpan={3}>No users available</td>
                                    </tr>
                                )
                            }
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Open Add Modal */}
            {modalType === 'add' && <UserForm isOpen={modalType === 'add'} close={closeModal} />}
            {modalType === 'edit' && selectedUser && <UserForm isOpen={modalType === 'edit'} close={closeModal} user={selectedUser} />}
            {modalType && selectedUser && selectedUser && <DeleteModal close={closeModal} user={selectedUser} isOpen={modalType === 'delete'} />}
        </>
    )
}

export default UserList