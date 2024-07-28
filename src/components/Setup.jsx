import Header from './Header';
import { Fragment, useState, useRef, useEffect } from 'react';
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
        subtraction_include_negatives: false,
        repeat_incorrect_questions: false,
    });
    const [validationMessage, setValidationMessage] = useState('');
    const alertDivRev = useRef(null);
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

    function toggleCheckboxState(key) {
        setInputs(prev => {
            const newState = { ...prev };
            newState[key] = !newState[key];
            return newState;
        });
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        const params = new URLSearchParams();
        Object.keys(inputs.question_types).forEach((questionType) => {
            if (inputs.question_types[questionType].selected) {
                params.append('question_types', questionType);
                Object.entries(inputs.question_types[questionType].options).forEach((optionSet, i) => {
                    Object.keys(inputs.question_types[questionType].options[i]).forEach(key => {
                        if (inputs.question_types[questionType].options[i][key]) {
                            params.append(`${questionType}_digits`, key);
                        }
                    });
                });
            }
        });

        if (inputs.subtraction_include_negatives) {
            params.append('subtraction_include_negatives', 1);
        }

        if (inputs.repeat_incorrect_questions) {
            params.append('repeat_incorrect_questions', 1);
        }

        const isValid = validateFormSubmission();
        
        if (isValid) {
            navigate(`/setup/play?${params.toString()}`);
        }
    }

    const validateFormSubmission = () => {
        const selectedQuestionTypes = Object.keys(inputs.question_types).filter((questionType) => {
            return inputs.question_types[questionType].selected;
        });
        
        if (selectedQuestionTypes.length) {
            const allSelectedQuestionTypesHaveSelectedOptions = selectedQuestionTypes.every((questionType) => {
                return inputs.question_types[questionType].options.some((option) => {
                    return Object.values(option).some(value => value);
                });
            });

            if (allSelectedQuestionTypesHaveSelectedOptions) {
                return true;
            } else {
                setValidationMessage('Please select at least one digit type for all question types.');
            }
        } else {
            setValidationMessage('Please select at least one question type.');
        }

        return false;
    }

    useEffect(() => {
        if (alertDivRev.current) {
            alertDivRev.current.scrollIntoView({ behavior: 'smooth' });
        }
      }, [validationMessage]);

    return (
        <div>
            <Header />
            <div className="container">
                <h1 className="display-2">Mental Maths</h1>
                <div className="js-pre-start mb-5">
                    {validationMessage && (
                        <div className="alert alert-warning" role="alert" ref={alertDivRev}>
                            {validationMessage}
                        </div>
                    )}
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
                                                            disabled={!inputs['question_types'][type]['selected']}
                                                        />
                                                        <label htmlFor={`${type}_${option}`}>{option.replace('x', ' by ')}</label>
                                                    </Fragment>
                                                ))}
                                            </div>
                                        ))}
                                        {type === 'subtraction' && (
                                            <div>
                                                <input 
                                                    type="checkbox" 
                                                    name="subtraction_include_negatives" 
                                                    id="subtraction_include_negatives" 
                                                    value="subtraction_include_negatives" 
                                                    onChange={() => toggleCheckboxState('subtraction_include_negatives')}
                                                    checked={inputs['subtraction_include_negatives']}
                                                    disabled={!inputs['question_types'][type]['selected']}
                                                ></input>
                                                <label htmlFor="subtraction_include_negatives">Include questions with negative results</label>
                                            </div>
                                        )}
                                    </fieldset>
                                </div>
                            ))}
                        </fieldset>
                        <fieldset>
                            <input type="checkbox"
                                name="repeat_incorrect_questions" 
                                id="repeat_incorrect_questions" 
                                value="repeat_incorrect_questions" 
                                onChange={() => toggleCheckboxState('repeat_incorrect_questions')} 
                                checked={inputs['repeat_incorrect_questions']}
                            ></input>
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