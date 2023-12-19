import Button from 'react-bootstrap/Button';
import Spinner from 'react-bootstrap/Spinner';

function Loading() {
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
        You are being redirected to payment gateway...
      </Button>
    </>
  );
}

export default Loading;