import React from 'react';

const Form = ({ handleChange, handleSubmit, poem, errors }) => {
  const formInvalid = Object.keys(errors).some(key => errors[key]);
  return (
    <form onSubmit={handleSubmit}>
      <div className="field">
        <label htmlFor="image">Image</label>
        <input id="image" name="image" className="input" placeholder="image"  onChange={handleChange}  value={poem.image || ''}/>
        {errors.name && <small>{errors.name}</small>}
      </div>

      <button disabled={ formInvalid } className="button is-primary">Submit</button>
    </form>
  );
};

export default Form;
