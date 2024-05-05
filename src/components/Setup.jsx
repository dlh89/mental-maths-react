import Header from './Header';
import { Fragment, useState } from 'react';
import { useNavigate  } from 'react-router-dom';

const Setup = () => {
    const [inputs, setInputs] = useState({
        question_types: {
            multiplication: {
                selected: false,
                options: [
                    {
                        "1x1": false,
                        "1x2": false,
                        "1x3": false,
                        "1x4": false,
                    },
                    {
                        "2x2": false,
                        "2x3": false,
                        "2x4": false,
                    },
                    {
                        "3x3": false,
                        "3x4": false,
                    },
                    {
                        "4x4": false,
                    },
                ]
            },
            addition: {
                selected: false,
                options: [
                    {
                        "1x1": false,
                        "1x2": false,
                        "1x3": false,
                        "1x4": false,
                    },
                    {
                        "2x2": false,
                        "2x3": false,
                        "2x4": false,
                    },
                    {
                        "3x3": false,
                        "3x4": false,
                    },
                    {
                        "4x4": false,
                    },
                ]
            },
            subtraction: {
                selected: false,
                options: [
                    {
                        "1x1": false,
                        "1x2": false,
                        "1x3": false,
                        "1x4": false,
                    },
                    {
                        "2x2": false,
                        "2x3": false,
                        "2x4": false,
                    },
                    {
                        "3x3": false,
                        "3x4": false,
                    },
                    {
                        "4x4": false,
                    },
                ]
            },
        },
        repeat_incorrect_questions: false,
    });
    const navigate = useNavigate();

    function handleCheckboxChange(type, option = null) {
        setInputs(prev => {
            const newState = { ...prev };
            if (option) {
                newState['question_types'][type].options.forEach((optionSet, i) => {
                    if (Object.keys(optionSet).includes(option)) {
                        newState['question_types'][type].options[i][option] = !newState['question_types'][type].options[i][option];
                    }
                })
            } else {
                newState['question_types'][type].selected = !newState['question_types'][type].selected;
            }
            return newState;
        });
    }

    function handleRepeatIncorrectCheckboxChange() {
        setInputs(prev => {
            const newState = { ...prev };
            newState['repeat_incorrect_questions'] = !newState['repeat_incorrect_questions'];
            return newState;
        });
    }

    const handleSubmit = ([event]) => {
        event.preventDefault();
        const params = new URLSearchParams();
        Object.keys(inputs).forEach(([type, data]) => {
            if (data.selected) {
                params.append('question_types', type);
                Object.entries(data.options).forEach(([option, checked]) => {
                    if (checked) {
                        params.append(`${type}_digits`, option);
                    }
                });
            }
        });
        const queryString = params.toString();
        navigate(`/setup/play?${queryString}`);
    }

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="display-2">Mental Maths</h1>
                <div className="js-pre-start mb-5">
                    <form method="get" onSubmit={handleSubmit}>
                        <fieldset className="start-form__fieldset">
                            <legend className="heading-2">Question types</legend>
                            {Object.keys(inputs['question_types']).map((type) => (
                                <div key={type}>
                                    <input
                                        type="checkbox"
                                        name="question_types"
                                        id={type}
                                        value={type}
                                        className="js-parent-field"
                                        checked={inputs['question_types'][type].selected}
                                        onChange={() => handleCheckboxChange(type)}
                                    />
                                    <label htmlFor={type}>{type.charAt(0).toUpperCase() + type.slice(1)}</label>
                                    <fieldset className="type-subset">
                                        <legend className="heading-3">Number of digits</legend>
                                        {Object.keys(inputs['question_types'][type].options).map((optionSet) => (
                                            <div key={type + '_' + optionSet}>
                                                {Object.keys(inputs['question_types'][type].options[optionSet]).map((option) => (
                                                    <Fragment key={type + '_' + optionSet + '_' + option}>
                                                        <input
                                                            type="checkbox"
                                                            name={`${type}_digits`}
                                                            id={`${type}_${option}`}
                                                            value={option}
                                                            className="js-child-field"
                                                            checked={inputs['question_types'][type].options[optionSet][option]}
                                                            onChange={() => handleCheckboxChange(type, option)}
                                                        />
                                                        <label htmlFor={`${type}_${option}`}>{option.replace('x', ' by ')}</label>
                                                    </Fragment>
                                                ))}
                                            </div>
                                        ))}
                                    </fieldset>
                                </div>
                            ))}
                        </fieldset>
                        <fieldset>
                            <input type="checkbox" name="repeat_incorrect_questions" id="repeat_incorrect_questions" value="repeat_incorrect_questions" onChange={() => handleRepeatIncorrectCheckboxChange()} checked={inputs['repeat_incorrect_questions']}></input>
                            <label htmlFor="repeat_incorrect_questions">Repeat incorrectly answered questions</label>
                        </fieldset>
                        <input type="submit" value="Start" className="btn btn-primary btn-lg mt-3"></input>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default Setup;