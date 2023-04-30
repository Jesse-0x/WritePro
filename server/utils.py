import tiktoken


def num_tokens_from_messages(messages, model="gpt-3.5-turbo-0301"):
    """Returns the number of tokens used by a list of messages."""
    try:
        encoding = tiktoken.encoding_for_model(model)
    except KeyError:
        encoding = tiktoken.get_encoding("cl100k_base")
    if model == "gpt-3.5-turbo-0301" or model == "gpt-3.5-turbo":
        num_tokens = 0
        for message in messages:
            num_tokens += 4  # every message follows <im_start>{role/name}\n{content}<im_end>\n
            for key, value in message.items():
                num_tokens += len(encoding.encode(value))
                if key == "name":  # if there's a name, the role is omitted
                    num_tokens += -1  # role is always required and always 1 token
        num_tokens += 2  # every reply is primed with <im_start>assistant
        return num_tokens
    else:
        raise NotImplementedError


"""
    {
      "index": 6,
      "category": "logic",
      "problem_sentence": "Please let me know if you can come, or if there's anything else you need to know.",
      "incorrect": "anything else you need to know",
      "fix": "if there is anything else you need to know",
      "reason": "Suggesting a more clear and concise phrase to replace the wordy and unclear phrase 'anything else you need to know'."
    }
    """
def json_check(json_file):
    """Checks if the output following the JSON format that I want."""
    if not isinstance(json_file, list): return {"error": "The output is not a list."}
    for item in json_file:
        if not isinstance(item, dict): json_file.remove(item)
        if item.keys() != {"category", "index", "problem_sentence", "incorrect", "fix", "reason"}: json_file.remove(item)
        # if item['category'] not in {"spelling", "grammar", "punctuation", "tone", "logic"}: json_file.remove(item)
        if not isinstance(item["category"], str): item["category"] = str(item["category"])
        if not isinstance(item["problem_sentence"], str): str(item["problem_sentence"])
        if not isinstance(item["incorrect"], str): json_file.remove(item)
        if not isinstance(item["fix"], str): item["fix"] = ''
        if not isinstance(item["reason"], str): item["reason"] = ''
    # give all the suggestion an index
    for i in range(len(json_file)):
        json_file[i]["index"] = i
    return json_file
