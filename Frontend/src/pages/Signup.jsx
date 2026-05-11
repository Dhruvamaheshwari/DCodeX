
import { useForm } from 'react-hook-form';

const Signup = () => {

    const { register, handleSubmit, formState: { errors }, } = useForm(); // this is the hook

    function submitData(data)
    {
        console.log(data)
    }


    return (
        <>
            <form onSubmit={handleSubmit(submitData)} className='flex justify-evenly mt-5'>
                {/* to take the first name  */}
                <input {...register('firstName')} placeholder='enter name' />
                {errors.firstName && <p>Last name is required.</p>}
                <input {...register('email')} placeholder='enter email'/>
                <input {...register('password')} placeholder='password'/>
            <button type='submit' className='btn btn-md bg-red-400/90 w-20'>Submit</button>
            </form>
        </>
    )
}

export default Signup