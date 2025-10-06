def generate_all_addition_problems():
    """Generate all possible addition problems (1-20 range)"""
    problems = []
    for num1 in range(1, 11):
        for num2 in range(1, 11):
            problem = f"{num1} + {num2} = "
            correct_answer = num1 + num2
            problems.append((problem, correct_answer))
    return problems