import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function Loading({message}) {
  return (
    <>
      <Button variant="primary" style={{margin: "0 1em"}} disabled>
        <Spinner
          as="span"
          animation="grow"
          size="sm"
          role="status"
          aria-hidden="true"
        />
        {message}
      </Button>
    </>
  );
}

export default Loading;