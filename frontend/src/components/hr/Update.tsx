import { useParams } from '@tanstack/react-router';
import Create from './Create';

const Update = () => {
  const { id } = useParams({ from: '/hr/vacancies/$id/update' });

  return <Create mode="update" vacancyId={id} />;
};

export default Update;
