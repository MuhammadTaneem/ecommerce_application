from django.http import HttpRequest
from typing import Dict, Any
import json
import re


class NestedFormDataMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request: HttpRequest):
        if request.method in ['POST', 'PUT', 'PATCH'] and request.content_type == 'multipart/form-data':
            self._parse_nested_form_data(request)
        return self.get_response(request)

    def _get_nested_dict(self, parts: list, value: Any) -> Dict:
        """Helper function to create nested dictionary from parts list"""
        if not parts:
            return value

        part = parts[0]
        # Clean up the part
        part = part.strip('[]\'\"')

        # Convert to int if it's a digit
        if part.isdigit():
            part = int(part)

        if len(parts) == 1:
            return {part: value}

        nested = self._get_nested_dict(parts[1:], value)
        return {part: nested}

    def _merge_dicts(self, dict1: Dict, dict2: Dict) -> Dict:
        """Recursively merge two dictionaries"""
        for key in dict2:
            if key in dict1:
                if isinstance(dict1[key], dict) and isinstance(dict2[key], dict):
                    self._merge_dicts(dict1[key], dict2[key])
                else:
                    dict1[key] = dict2[key]
            else:
                dict1[key] = dict2[key]
        return dict1

    def _parse_nested_form_data(self, request: HttpRequest) -> None:
        """Parse nested form data and restructure it into a nested dictionary."""
        parsed_data: Dict[str, Any] = {}

        # Process POST data
        for key, value in request.POST.items():
            if key in request.FILES:
                continue

            parts = re.findall(r'\[.*?\]|[^\[\]]+', key)
            nested_dict = self._get_nested_dict(parts, value)
            parsed_data = self._merge_dicts(parsed_data, nested_dict)

        # Process FILES data
        for key, file in request.FILES.items():
            parts = re.findall(r'\[.*?\]|[^\[\]]+', key)
            nested_dict = self._get_nested_dict(parts, file)
            parsed_data = self._merge_dicts(parsed_data, nested_dict)

        # Convert numeric keys to list where appropriate
        def dict_to_list(d):
            if isinstance(d, dict):
                # Check if all keys are integers
                if all(isinstance(k, int) for k in d.keys()):
                    # Convert to list
                    max_key = max(d.keys())
                    result = [None] * (max_key + 1)
                    for k, v in d.items():
                        result[k] = dict_to_list(v) if isinstance(v, dict) else v
                    return result
                return {k: dict_to_list(v) if isinstance(v, dict) else v for k, v in d.items()}
            return d

        parsed_data = dict_to_list(parsed_data)
        request.nested_data = parsed_data