import { Result } from 'antd';
import { SmileOutlined,  } from '@ant-design/icons';
import { RouteComponentProps } from '@reach/router';
import useCurrentUser from '../../hooks/use-current-user';

export default function Account(_: RouteComponentProps) {
  const currentUser = useCurrentUser();

  return currentUser && (
    <Result
      title={`Добро пожаловать ${currentUser.name}`}
      icon={<SmileOutlined />}
    />
  );
}
