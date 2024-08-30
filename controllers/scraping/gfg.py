import requests
from bs4 import BeautifulSoup
import json
import sys

async def get_gfg_stats(username):
    url = f"https://www.geeksforgeeks.org/user/{username}/"

    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            if response.status == 200:
                content = await response.text()
                soup = BeautifulSoup(content, 'html.parser')

                profile_picture = soup.select_one('.profilePicSection_head_img__1GLm0 img')['src']
                profile_handle = soup.select_one('.profilePicSection_head_userHandle__oOfFy').text
                institution_name = soup.select_one('.educationDetails_head_left--text__tgi9I').text
                rank = soup.select_one('.educationDetails_head_left_userRankContainer--text__wt81s').text

                data = {}

                text_elements = soup.find_all('div', class_='scoreCard_head_left--text__KZ2S1')
                score_elements = soup.find_all('div', class_='scoreCard_head_left--score__oSi_x')

                for text_element in text_elements:
                    text = text_element.get_text(strip=True)
                    next_sibling = text_element.find_next_sibling('div', class_='scoreCard_head_left--score__oSi_x')
                    if next_sibling:
                        score = next_sibling.get_text(strip=True)
                        data[text] = score

                coding_score = data.get('Coding Score', 'N/A')
                problems_solved = data.get('Problem Solved', 'N/A')

                languages_used = soup.select_one('.educationDetails_head_right--text__lLOHI').text
                best_potd_streak = soup.select_one('.circularProgressBar_head_mid_streakCnt__MFOF1').text

                difficulty_data = {}
                difficulty_elements = soup.find_all('div', class_='problemNavbar_head_nav--text__UaGCx')

                for difficulty_element in difficulty_elements:
                    text = difficulty_element.get_text(strip=True)
                    if '(' in text and ')' in text:
                        difficulty_name = text.split('(')[0].strip()
                        difficulty_count = text.split('(')[1].split(')')[0].strip()
                        difficulty_data[difficulty_name] = difficulty_count

                result = {
                    'Profile Picture': profile_picture,
                    'Profile Handle': profile_handle,
                    'Institution Name': institution_name,
                    'Rank': rank,
                    'Coding Score': coding_score,
                    'Problems Solved': problems_solved,
                    'Languages Used': languages_used,
                    'Best POTD Streak': best_potd_streak,
                    'Difficulty Data': difficulty_data
                }

                # Return the result as JSON
                return json.dumps(result, indent=4)
            else:
                error_message = f"Failed to retrieve data for username '{username}'. Status code: {response.status}"
                return json.dumps({'error': error_message}, indent=4)

async def main(username):
    json_data = await get_gfg_stats(username)
    print(json_data)

if __name__ == "__main__":
    if len(sys.argv) > 1:
        username = sys.argv[1]
        print(username)
        asyncio.run(main(username))
    else:
        print("Username not provided. Please provide a username as an argument.")