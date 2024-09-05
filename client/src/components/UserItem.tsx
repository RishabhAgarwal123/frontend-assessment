import { ReactComponent as EditIcon } from '../assets/edit.svg';
import { ReactComponent as DeleteIcon } from '../assets/delete.svg';

type PropsType = {
    name: string,
    email: string,
    onEdit: () => void,
    onDelete: () => void
}

const UserItem = ({ name, email, onEdit, onDelete }: PropsType) => {

    return (
        <tr>
            <td className="border border-gray-300 p-6" data-label="Name">
                {name}
            </td>
            <td className="border border-gray-300 p-6" data-label="Email">
                {email}
            </td>
            <td className="border border-gray-300 p-6" data-label="Action">
                <button
                    className="icon"
                    onClick={onEdit}
                    aria-label={`Edit ${name}`}
                >
                    <EditIcon />
                </button>
                <button
                    className="icon"
                    onClick={onDelete}
                    aria-label={`Delete ${name}`}
                >
                    <DeleteIcon />
                </button>
            </td>
        </tr>

    )
}

export default UserItem