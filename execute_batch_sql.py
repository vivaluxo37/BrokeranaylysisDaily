import os

def read_batch_sql_file():
    """Read the complete batch SQL file"""
    sql_file = 'scripts/batch_insert_all_remaining_articles.sql'
    
    try:
        with open(sql_file, 'r', encoding='utf-8') as f:
            sql_content = f.read()
        
        print(f"Read SQL file: {len(sql_content)} characters")
        return sql_content
    except Exception as e:
        print(f"Error reading SQL file: {e}")
        return None

def save_sql_for_mcp(sql_content):
    """Save the SQL content in a format ready for MCP execution"""
    # Clean up the SQL content
    sql_content = sql_content.strip()
    
    # Save to a file for manual execution
    output_file = 'batch_sql_for_mcp.txt'
    with open(output_file, 'w', encoding='utf-8') as f:
        f.write(sql_content)
    
    print(f"SQL content saved to: {output_file}")
    print(f"Content length: {len(sql_content)} characters")
    
    # Count the number of VALUES entries
    values_count = sql_content.count('VALUES') + sql_content.count('),\n(') 
    print(f"Estimated number of articles: {values_count}")
    
    return sql_content

if __name__ == "__main__":
    print("Reading batch SQL file...")
    sql_content = read_batch_sql_file()
    
    if sql_content:
        print("Preparing SQL for MCP execution...")
        save_sql_for_mcp(sql_content)
        print("\nReady for MCP execution!")
    else:
        print("Failed to read SQL file.")