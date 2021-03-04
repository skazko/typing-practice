import { Result } from 'antd';
import { SmileOutlined,  } from '@ant-design/icons';
import { User } from '../../entities/user';

type AccountProps = {
  user: User
}

export default function Account({user}: AccountProps) {
  return (
    <Result
      title={`Добро пожаловать ${user.name}`}
      icon={<SmileOutlined />}
    />
  );
}
