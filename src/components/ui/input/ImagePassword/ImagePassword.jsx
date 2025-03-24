import css from './ImagePassword.module.css';

export const ImagePassword = ({
    ref,
    className,
    onSubmit,
    onInput,
    ...props
}) => {
    return (
        <div ref={ref} className={`${className}`} {...props}>

        </div>
    );
}