interface ButtonSubmitProps {
    isLoading: boolean;
}

const ButtonSubmit = ({ isLoading }: ButtonSubmitProps) => {
    return (
        <button
            type='submit'
            className={`w-100 py-2 btn ${
                isLoading ? 'btn-secondary' : 'btn-primary'
            }`}
            disabled={isLoading}>
            {isLoading ? (
                <>
                    <span
                        className='spinner-border spinner-border-sm'
                        role='status'
                        aria-hidden='true'></span>
                    <span className='sr-only'>Loading...</span>
                </>
            ) : (
                'Submit'
            )}
        </button>
    );
};

export default ButtonSubmit;
