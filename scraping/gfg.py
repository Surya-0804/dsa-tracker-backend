import requests
from bs4 import BeautifulSoup
import json
import sys

def get_gfg_stats(username):
    # Construct the URL with the username
    url = f"https://auth.geeksforgeeks.org/user/{username}"
    
    response = requests.get(url)
    user = BeautifulSoup(response.content, 'html.parser')

    # Extracting various details
    profile_pic_src = user.find(class_='profile_pic')['src']

    institute_rank = user.find(class_='profile_details_section activity-container-1 section_card') \
                         .find(class_='profile_rank_div tooltipped') \
                         .find(class_='rankNum').text.strip()

    institution = user.find(class_='col l4 m4 s12')
    inst_name = institution.find(class_='basic_details_data').text.strip()

    streak_info = user.find(class_='streakCnt tooltipped').get_text(strip=True).split('/')
    user_streak = streak_info[0].strip()
    global_streak = streak_info[1].strip()

    score_cards = user.find(class_='row score_cards_container').findAll(class_='col xl3 l6 m6 s12')
    scores = {sc.find(class_='score_card_name').text.strip(): sc.find(class_='score_card_value').text.strip() for sc in score_cards}

    languages_used = user.findAll(class_='col l4 m4 s12')[1].find(class_='basic_details_data').text.strip()

    # Extracting the number of problems solved per difficulty level
    problems_solved = {}
    no_solved = user.find(class_='col xl8 l8 m8 s8 typeLangSection').findAll(class_='tab')
    for item in no_solved:
        difficulty, count = item.text.split(' ')
        problems_solved[difficulty] = int(count[1:-1])  # Removing parentheses and converting count to integer

    # Extracting the list of solved problems
    problem_sections = user.find(class_='col xl8 l8 m8 s8 typeLangSection').find(class_='problem_list_section').findAll(class_='row')
    difficulty_levels = ["SCHOOL", "BASIC", "EASY", "MEDIUM", "HARD"]
    problems = {difficulty: [] for difficulty in difficulty_levels}

    for i, section in enumerate(problem_sections):
        problem_links = section.findAll('a', class_='problemLink')
        for q in problem_links:
            problems[difficulty_levels[i]].append({
                "link": q['href'],
                "title": q.text.strip()
            })

    # Organizing data into a dictionary
    data = {
        "profile_picture": profile_pic_src,
        "institute_rank": institute_rank,
        "institution_name": inst_name,
        "user_streak": user_streak,
        "global_streak": global_streak,
        "scores": scores,
        "languages_used": languages_used,
        "problems_solved": problems_solved,
        "problems": problems
    }

    # Serializing the dictionary to a JSON formatted string
    data_json = json.dumps(data, indent=4)

    # Writing the JSON data to a file
    with open('GFG_stats.json', 'w') as file:
        file.write(data_json)

if __name__ == "__main__":
    # Get username from command line arguments
    username ="gantavenkatakousik2021"
    get_gfg_stats(username)
